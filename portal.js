/* ==========================================================================
   Staff Portal Logic
   S S Enterprises - Admin / Staff Portal
   Handles: Firebase Auth guard, Login/Logout, Cloudinary unsigned upload,
   Firestore CRUD for "jobs" collection, drag & drop, validation, toasts,
   loading spinners, and delete confirmation modal.
   ========================================================================== */

(function () {
    'use strict';

    // ---- DOM References ----
    const loginScreen = document.getElementById('loginScreen');
    const dashboardScreen = document.getElementById('dashboardScreen');
    const loginForm = document.getElementById('loginForm');
    const loginEmail = document.getElementById('loginEmail');
    const loginPassword = document.getElementById('loginPassword');
    const loginError = document.getElementById('loginError');
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const authCheckOverlay = document.getElementById('authCheckOverlay');

    const uploadNewJobBtn = document.getElementById('uploadNewJobBtn');
    const manageJobsBtn = document.getElementById('manageJobsBtn');
    const jobsManageContainer = document.getElementById('jobsManageContainer');

    const uploadModalEl = document.getElementById('uploadJobModal');
    const uploadModal = uploadModalEl ? new bootstrap.Modal(uploadModalEl) : null;
    const uploadModalTitle = document.getElementById('uploadModalTitle');
    const jobForm = document.getElementById('jobForm');
    const jobFileInput = document.getElementById('jobFileInput');
    const dropZone = document.getElementById('dropZone');
    const dropZoneContent = document.getElementById('dropZoneContent');
    const previewImg = document.getElementById('previewImg');
    const postedDateInput = document.getElementById('postedDateInput');
    const saveJobBtn = document.getElementById('saveJobBtn');
    const saveJobSpinner = document.getElementById('saveJobSpinner');
    const editingJobIdInput = document.getElementById('editingJobId');
    const editingCreatedAtInput = document.getElementById('editingCreatedAt');

    const deleteConfirmModalEl = document.getElementById('deleteConfirmModal');
    const deleteConfirmModal = deleteConfirmModalEl ? new bootstrap.Modal(deleteConfirmModalEl) : null;
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

    const toastContainer = document.getElementById('portalToastContainer');

    const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

    let selectedFile = null;
    let jobIdPendingDelete = null;

    // ---- Toast Helper ----
    function showToast(message, type) {
        type = type || 'primary';
        const toastEl = document.createElement('div');
        toastEl.className = `toast align-items-center text-white bg-${type} border-0 mb-2`;
        toastEl.setAttribute('role', 'alert');
        toastEl.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">${message}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>`;
        toastContainer.appendChild(toastEl);
        const bsToast = new bootstrap.Toast(toastEl, { delay: 3500 });
        bsToast.show();
        toastEl.addEventListener('hidden.bs.toast', function () {
            toastEl.remove();
        });
    }

    // ---- Auth Guard ----
    auth.onAuthStateChanged(function (user) {
        if (authCheckOverlay) authCheckOverlay.style.display = 'none';
        if (user) {
            loginScreen.classList.add('d-none');
            dashboardScreen.classList.remove('d-none');
            loadJobsForManagement();
        } else {
            dashboardScreen.classList.add('d-none');
            loginScreen.classList.remove('d-none');
        }
    });

    // ---- Login ----
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            loginError.classList.add('d-none');
            loginBtn.disabled = true;
            loginBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Logging in...';

            auth.signInWithEmailAndPassword(loginEmail.value.trim(), loginPassword.value)
                .then(function () {
                    showToast('Login successful. Welcome back!', 'success');
                })
                .catch(function (error) {
                    loginError.textContent = 'Invalid email or password. Please try again.';
                    loginError.classList.remove('d-none');
                })
                .finally(function () {
                    loginBtn.disabled = false;
                    loginBtn.innerHTML = '<i class="fas fa-sign-in-alt me-2"></i>Login';
                });
        });
    }

    // ---- Logout ----
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            auth.signOut().then(function () {
                showToast('You have been logged out.', 'secondary');
            });
        });
    }

    // ---- Dashboard Buttons ----
    if (uploadNewJobBtn) {
        uploadNewJobBtn.addEventListener('click', function () {
            openUploadModal(false);
        });
    }

    if (manageJobsBtn) {
        manageJobsBtn.addEventListener('click', function () {
            jobsManageContainer.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // ---- Upload Modal Open/Reset ----
    function openUploadModal(isReplace, jobData) {
        jobForm.reset();
        selectedFile = null;
        previewImg.classList.add('d-none');
        dropZoneContent.classList.remove('d-none');
        editingJobIdInput.value = '';
        editingCreatedAtInput.value = '';
        postedDateInput.value = new Date().toISOString().split('T')[0];

        if (isReplace && jobData) {
            uploadModalTitle.textContent = 'Replace Job Poster';
            editingJobIdInput.value = jobData.id;
            editingCreatedAtInput.value = jobData.createdAt ? JSON.stringify(jobData.createdAt) : '';
            postedDateInput.value = jobData.postedDate || postedDateInput.value;
            previewImg.src = jobData.imageUrl;
            previewImg.classList.remove('d-none');
            dropZoneContent.classList.add('d-none');
        } else {
            uploadModalTitle.textContent = 'Upload New Job';
        }

        uploadModal.show();
    }

    window.openReplaceModal = function (jobId, imageUrl, postedDate) {
        openUploadModal(true, { id: jobId, imageUrl: imageUrl, postedDate: postedDate });
    };

    // ---- Drag & Drop + Click to Upload ----
    if (dropZone) {
        dropZone.addEventListener('click', function () {
            jobFileInput.click();
        });

        dropZone.addEventListener('dragover', function (e) {
            e.preventDefault();
            dropZone.classList.add('drag-over');
        });

        dropZone.addEventListener('dragleave', function () {
            dropZone.classList.remove('drag-over');
        });

        dropZone.addEventListener('drop', function (e) {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
            if (e.dataTransfer.files && e.dataTransfer.files.length) {
                handleFileSelect(e.dataTransfer.files[0]);
            }
        });
    }

    if (jobFileInput) {
        jobFileInput.addEventListener('change', function () {
            if (jobFileInput.files && jobFileInput.files.length) {
                handleFileSelect(jobFileInput.files[0]);
            }
        });
    }

    function handleFileSelect(file) {
        if (!ALLOWED_TYPES.includes(file.type)) {
            showToast('Only JPG, JPEG, PNG, and WEBP images are allowed.', 'danger');
            return;
        }
        if (file.size > MAX_SIZE_BYTES) {
            showToast('Image size must not exceed 5 MB.', 'danger');
            return;
        }

        selectedFile = file;
        const reader = new FileReader();
        reader.onload = function (e) {
            previewImg.src = e.target.result;
            previewImg.classList.remove('d-none');
            dropZoneContent.classList.add('d-none');
        };
        reader.readAsDataURL(file);
    }

    // ---- Cloudinary Upload ----
    function uploadToCloudinary(file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        return fetch(CLOUDINARY_UPLOAD_URL, {
            method: 'POST',
            body: formData
        }).then(function (res) {
            if (!res.ok) throw new Error('Cloudinary upload failed');
            return res.json();
        });
    }

    // ---- Save Job (Create or Replace) ----
    if (jobForm) {
        jobForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const editingJobId = editingJobIdInput.value;
            const postedDate = postedDateInput.value;

            if (!postedDate) {
                showToast('Please select a posted date.', 'danger');
                return;
            }
            if (!editingJobId && !selectedFile) {
                showToast('Please select an image to upload.', 'danger');
                return;
            }

            saveJobBtn.disabled = true;
            saveJobSpinner.classList.remove('d-none');

            const proceed = selectedFile
                ? uploadToCloudinary(selectedFile)
                : Promise.resolve(null);

            proceed.then(function (cloudinaryResult) {
                if (editingJobId) {
                    // Replace existing job
                    const updateData = { postedDate: postedDate };
                    if (cloudinaryResult) {
                        updateData.imageUrl = cloudinaryResult.secure_url;
                        updateData.publicId = cloudinaryResult.public_id;
                    }
                    return db.collection('jobs').doc(editingJobId).update(updateData).then(function () {
                        showToast('Job poster replaced successfully.', 'success');
                    });
                } else {
                    // Create new job
                    return db.collection('jobs').add({
                        imageUrl: cloudinaryResult.secure_url,
                        publicId: cloudinaryResult.public_id,
                        postedDate: postedDate,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    }).then(function () {
                        showToast('New job uploaded successfully.', 'success');
                    });
                }
            }).catch(function (error) {
                console.error(error);
                showToast('Something went wrong. Please try again.', 'danger');
            }).finally(function () {
                saveJobBtn.disabled = false;
                saveJobSpinner.classList.add('d-none');
                uploadModal.hide();
            });
        });
    }

    // ---- Load Jobs for Management Grid ----
    function loadJobsForManagement() {
        jobsManageContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="spinner-border text-primary" role="status"></div>
                <p class="mt-3 text-muted mb-0">Loading jobs...</p>
            </div>`;

        db.collection('jobs').orderBy('createdAt', 'desc').onSnapshot(function (snapshot) {
            if (snapshot.empty) {
                jobsManageContainer.innerHTML = `
                    <div class="col-12 portal-empty-state">
                        <i class="fas fa-inbox fa-3x mb-3 text-primary opacity-50"></i>
                        <p class="mb-0">No jobs uploaded yet. Click "Upload New Job" to get started.</p>
                    </div>`;
                return;
            }

            let html = '';
            snapshot.forEach(function (doc) {
                const job = doc.data();
                const thumb = job.imageUrl && job.imageUrl.indexOf('/upload/') !== -1
                    ? job.imageUrl.replace('/upload/', '/upload/f_auto,q_auto,w_200/')
                    : job.imageUrl;

                html += `
                    <div class="col-sm-6 col-lg-4 col-xl-3 fade-in">
                        <div class="job-manage-card h-100">
                            <div class="job-thumb-wrap">
                                <img src="${thumb}" alt="Job Poster Thumbnail" loading="lazy">
                            </div>
                            <div class="p-3">
                                <p class="text-muted small mb-2"><i class="fas fa-calendar-alt text-primary me-2"></i>${job.postedDate || 'N/A'}</p>
                                <div class="d-flex gap-2">
                                    <button class="btn btn-sm btn-outline-primary flex-fill" onclick='openReplaceModal("${doc.id}", ${JSON.stringify(job.imageUrl)}, ${JSON.stringify(job.postedDate || '')})'>
                                        <i class="fas fa-sync-alt me-1"></i>Replace
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger flex-fill" onclick="promptDeleteJob('${doc.id}')">
                                        <i class="fas fa-trash-alt me-1"></i>Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>`;
            });

            jobsManageContainer.innerHTML = html;
        }, function (error) {
            console.error(error);
            jobsManageContainer.innerHTML = `<div class="col-12 portal-empty-state"><p class="mb-0">Unable to load jobs.</p></div>`;
        });
    }

    // ---- Delete Job ----
    window.promptDeleteJob = function (jobId) {
        jobIdPendingDelete = jobId;
        deleteConfirmModal.show();
    };

    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', function () {
            if (!jobIdPendingDelete) return;
            confirmDeleteBtn.disabled = true;
            confirmDeleteBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Deleting...';

            db.collection('jobs').doc(jobIdPendingDelete).delete()
                .then(function () {
                    showToast('Job deleted successfully.', 'success');
                })
                .catch(function (error) {
                    console.error(error);
                    showToast('Failed to delete job.', 'danger');
                })
                .finally(function () {
                    jobIdPendingDelete = null;
                    confirmDeleteBtn.disabled = false;
                    confirmDeleteBtn.innerHTML = 'Delete';
                    deleteConfirmModal.hide();
                });
        });
    }

})();
