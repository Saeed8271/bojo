/* ==========================================================================
   Latest Jobs - Homepage Live Feed
   S S Enterprises
   Reads the "jobs" Firestore collection in real time (onSnapshot) and
   renders newest-first responsive cards. No page refresh required.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('latestJobsContainer');
    if (!container) return;

    const lightboxModalEl = document.getElementById('jobLightboxModal');
    const lightboxImage = document.getElementById('jobLightboxImage');
    const lightboxModal = lightboxModalEl ? new bootstrap.Modal(lightboxModalEl) : null;

    function cloudinaryTransform(url, transformation) {
        if (!url || url.indexOf('/upload/') === -1) return url;
        return url.replace('/upload/', `/upload/${transformation}/`);
    }

    function formatDate(dateValue) {
        try {
            const d = dateValue.toDate ? dateValue.toDate() : new Date(dateValue);
            return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
        } catch (e) {
            return '';
        }
    }

    function renderJobs(snapshot) {
        if (snapshot.empty) {
            container.innerHTML = `
                <div class="col-12 text-center text-muted py-5">
                    <i class="fas fa-briefcase fa-3x mb-3 text-primary opacity-50"></i>
                    <p class="mb-0">No job openings posted yet. Please check back soon.</p>
                </div>`;
            return;
        }

        let html = '';
        snapshot.forEach(function (doc) {
            const job = doc.data();
            const cardImg = cloudinaryTransform(job.imageUrl, 'f_auto,q_auto,w_800');
            const fullImg = cloudinaryTransform(job.imageUrl, 'f_auto,q_auto,w_1600');
            const posted = job.postedDate ? formatDate(job.postedDate) : '';

            html += `
                <div class="col-md-6 col-lg-4">
                    <div class="card h-100 border-0 shadow-sm overflow-hidden rounded-3">
                        <div class="job-poster-wrap" style="height: 320px; overflow: hidden; cursor: pointer; background:#f8f9fa;" data-full="${fullImg}">
                            <img src="${cardImg}" alt="Job Poster" loading="lazy" class="w-100 h-100 object-fit-cover transition-transform" style="transition: transform 0.3s ease;">
                        </div>
                        <div class="card-body p-3 bg-white border-top text-center">
                            <p class="text-muted small mb-0"><i class="fas fa-calendar-alt text-primary me-2"></i>Posted: ${posted}</p>
                        </div>
                    </div>
                </div>`;
        });

        container.innerHTML = html;

        container.querySelectorAll('.job-poster-wrap').forEach(function (el) {
            el.addEventListener('click', function () {
                const fullUrl = el.getAttribute('data-full');
                if (lightboxImage && lightboxModal) {
                    lightboxImage.src = fullUrl;
                    lightboxModal.show();
                }
            });
        });
    }

    try {
        db.collection('jobs')
            .orderBy('createdAt', 'desc')
            .onSnapshot(function (snapshot) {
                renderJobs(snapshot);
            }, function (error) {
                console.error('Error loading jobs:', error);
                container.innerHTML = `
                    <div class="col-12 text-center text-muted py-5">
                        <p class="mb-0">Unable to load job listings right now.</p>
                    </div>`;
            });
    } catch (err) {
        console.error('Firebase not configured correctly:', err);
    }
});
