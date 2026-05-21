/* ==========================================================================
   INTERACTIVE LOGIC & FUNCTIONALITY
   Project: Sifat Creative Studio Portfolio
   Author: Sifat Ullah
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // =============================
    // 5. ADMIN PORTAL & DYNAMIC PORTFOLIO
    // =============================
    // State management for portfolio projects
    const defaultProjects = [
        { title: "Brand Identity", category: "branding", img: "assets/work1.png" },
        { title: "Social Media Campaign", category: "social", img: "assets/work2.png" },
        { title: "YouTube Thumbnail", category: "thumbnail", img: "assets/work3.png" },
        { title: "UI Mockup", category: "ui", img: "assets/work4.png" },
        { title: "Print Banner", category: "print", img: "assets/work5.png" },
        { title: "Creative Poster", category: "other", img: "assets/work6.png" }
    ];
    const storageKey = "sifat_projects";
    let projects = [];

    function loadProjects() {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
            try { projects = JSON.parse(stored); }
            catch { projects = defaultProjects; }
        } else {
            projects = defaultProjects;
        }
    }

    function saveProjects() {
        localStorage.setItem(storageKey, JSON.stringify(projects));
    }

    function createProjectCard(proj) {
        const card = document.createElement('div');
        card.className = 'portfolio-item-card';
        card.setAttribute('data-category', proj.category);
        card.innerHTML = `
            <div class="portfolio-image-wrapper">
                <img src="${proj.img}" alt="${proj.title}" class="portfolio-image" loading="lazy">
                <div class="portfolio-hover-overlay">
                    <div class="view-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"></path></svg></div>
                </div>
            </div>
            <div class="portfolio-info">
                <span class="portfolio-tag">${proj.category}</span>
                <h3 class="portfolio-item-title">${proj.title}</h3>
            </div>`;
        return card;
    }

    function renderPortfolioGrid() {
        const grid = document.getElementById('portfolio-items-grid');
        if (!grid) return;
        grid.innerHTML = '';
        projects.forEach(proj => {
            const card = createProjectCard(proj);
            grid.appendChild(card);
        });
        // Reattach click handlers for lightbox
        const cards = grid.querySelectorAll('.portfolio-item-card');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const imgSrc = card.querySelector('.portfolio-image').getAttribute('src');
                const title = card.querySelector('.portfolio-item-title').innerText;
                const tag = card.querySelector('.portfolio-tag').innerText;
                currentImgIndex = Array.from(activeFilterItems).indexOf(card);
                openLightboxViewer(imgSrc, title, tag);
            });
        });
    }

    // Admin passcode handling
    const passcodeModal = document.getElementById('admin-passcode-modal');
    const dashboardModal = document.getElementById('admin-dashboard-modal');
    const closePasscodeBtn = document.getElementById('close-passcode-modal');
    const submitPasscodeBtn = document.getElementById('admin-passcode-submit');
    const passcodeInput = document.getElementById('admin-passcode-input');
    const closeDashboardBtn = document.getElementById('close-dashboard-modal');

    function openPasscodeModal() {
        passcodeModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    function closePasscodeModal() {
        passcodeModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        passcodeInput.value = '';
    }
    function openDashboard() {
        dashboardModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        populateProjectList();
    }
    function closeDashboard() {
        dashboardModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    if (closePasscodeBtn) closePasscodeBtn.addEventListener('click', closePasscodeModal);
    if (closeDashboardBtn) closeDashboardBtn.addEventListener('click', closeDashboard);

    if (submitPasscodeBtn) {
        submitPasscodeBtn.addEventListener('click', () => {
            const code = passcodeInput.value.trim();
            if (code === 'sifat2026') {
                closePasscodeModal();
                openDashboard();
            } else {
                alert('Incorrect passcode');
            }
        });
    }

    // Hotkey and avatar double-click trigger
    window.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.altKey && e.key === 'a') {
            openPasscodeModal();
        }
    });
    const avatarImg = document.getElementById('avatar-img-main');
    if (avatarImg) {
        avatarImg.addEventListener('dblclick', openPasscodeModal);
    }

    // Admin project management
    const addBtn = document.getElementById('admin-add-project');
    const titleInput = document.getElementById('admin-new-title');
    const categorySelect = document.getElementById('admin-new-category');
    const imageInput = document.getElementById('admin-new-image');
    const projectListEl = document.getElementById('admin-project-list');
    const exportArea = document.getElementById('admin-export-area');
    const copyExportBtn = document.getElementById('admin-copy-export');

    function populateProjectList() {
        if (!projectListEl) return;
        projectListEl.innerHTML = '';
        projects.forEach((proj, idx) => {
            const li = document.createElement('li');
            li.style.display='flex';li.style.alignItems='center';li.style.justifyContent='space-between';li.style.marginBottom='8px';
            li.innerHTML = `
                <span>${proj.title} (${proj.category})</span>
                <button class="btn btn-primary" data-index="${idx}" style="font-size:0.8rem;">Delete</button>
            `;
            const delBtn = li.querySelector('button');
            delBtn.addEventListener('click', () => {
                projects.splice(idx,1);
                saveProjects();
                renderPortfolioGrid();
                populateProjectList();
            });
            projectListEl.appendChild(li);
        });
    }

    if (addBtn) {
        addBtn.addEventListener('click', () => {
            const title = titleInput.value.trim();
            const category = categorySelect.value;
            const file = imageInput.files[0];
            if (!title || !category || !file) {
                alert('Please provide title, category, and image');
                return;
            }
            const reader = new FileReader();
            reader.onload = function(e) {
                const imgData = e.target.result; // base64 data URL
                projects.push({ title, category, img: imgData });
                saveProjects();
                renderPortfolioGrid();
                populateProjectList();
                // clear inputs
                titleInput.value='';
                imageInput.value='';
            };
            reader.readAsDataURL(file);
        });
    }

    // Export configuration
    function exportConfig() {
        const configStr = `const defaultProjects = ${JSON.stringify(projects, null, 4)};`;
        if (exportArea) exportArea.value = configStr;
    }
    if (copyExportBtn) {
        copyExportBtn.addEventListener('click', () => {
            exportConfig();
            exportArea.select();
            document.execCommand('copy');
            alert('Configuration copied to clipboard');
        });
    }
    // Blog post management
    const postTitleInput = document.getElementById('admin-new-post-title');
    const postContentInput = document.getElementById('admin-new-post-content');
    const addPostBtn = document.getElementById('admin-add-post');
    const postListEl = document.getElementById('admin-post-list');
    const postsKey = 'admin_blog_posts';
    let blogPosts = [];
    function loadPosts(){ const stored = localStorage.getItem(postsKey); if(stored){ try{ blogPosts = JSON.parse(stored);}catch{ blogPosts = []; } }
    }
    function savePosts(){ localStorage.setItem(postsKey, JSON.stringify(blogPosts)); }
    function renderPostList(){ if(!postListEl) return; postListEl.innerHTML=''; blogPosts.forEach((p,i)=>{ const li=document.createElement('li'); li.style.display='flex'; li.style.justifyContent='space-between'; li.style.alignItems='center'; li.style.marginBottom='6px'; li.innerHTML=`<span>${p.title}</span><button data-index="${i}" class="btn btn-primary" style="font-size:0.8rem;">Delete</button>`; const delBtn=li.querySelector('button'); delBtn.addEventListener('click',()=>{ blogPosts.splice(i,1); savePosts(); renderPostList(); }); postListEl.appendChild(li); }); }
    if(addPostBtn){ addPostBtn.addEventListener('click',()=>{ const title=postTitleInput.value.trim(); const content=postContentInput.value.trim(); if(!title||!content){ alert('Provide title and content'); return; } blogPosts.push({title,content}); savePosts(); renderPostList(); postTitleInput.value=''; postContentInput.value=''; }); }
    // Resource upload management
    const resourceInput = document.getElementById('admin-resource-input');
    const addResourceBtn = document.getElementById('admin-add-resource');
    const resourceListEl = document.getElementById('admin-resource-list');
    const resourcesKey='admin_resources';
    let resources=[];
    function loadResources(){ const stored=localStorage.getItem(resourcesKey); if(stored){ try{ resources=JSON.parse(stored);}catch{ resources=[];} } }
    function saveResources(){ localStorage.setItem(resourcesKey, JSON.stringify(resources)); }
    function renderResourceList(){ if(!resourceListEl) return; resourceListEl.innerHTML=''; resources.forEach((r,i)=>{ const li=document.createElement('li'); li.style.display='flex'; li.style.justifyContent='space-between'; li.style.alignItems='center'; li.style.marginBottom='6px'; li.innerHTML=`<span>${r.name}</span><a href="${r.data}" download="${r.name}" class="btn btn-primary" style="font-size:0.8rem;">Download</a><button data-index="${i}" class="btn btn-primary" style="font-size:0.8rem; margin-left:4px;">Delete</button>`; const delBtn=li.querySelector('button'); delBtn.addEventListener('click',()=>{ resources.splice(i,1); saveResources(); renderResourceList(); }); resourceListEl.appendChild(li); }); }
    if(addResourceBtn){ addResourceBtn.addEventListener('click',()=>{ const file=resourceInput.files[0]; if(!file){ alert('Select a file'); return; } const reader=new FileReader(); reader.onload=e=>{ const data=e.target.result; resources.push({name:file.name, data}); saveResources(); renderResourceList(); resourceInput.value=''; }; reader.readAsDataURL(file); }); }
    // Initialize
    loadPosts(); renderPostList();
    loadResources(); renderResourceList();

// ---------- FAQ MANAGEMENT ----------
const faqKey = 'admin_faqs';
let faqs = [];
function loadFAQs() {
    const stored = localStorage.getItem(faqKey);
    if (stored) {
        try {
            faqs = JSON.parse(stored);
        } catch {
            faqs = [];
        }
    }
}
function saveFAQs() { localStorage.setItem(faqKey, JSON.stringify(faqs)); }
function renderFAQList() {
    const list = document.getElementById('admin-faq-list');
    if (!list) return;
    list.innerHTML = '';
    faqs.forEach((f, i) => {
        const li = document.createElement('li');
        li.style.display = 'flex';
        li.style.justifyContent = 'space-between';
        li.style.alignItems = 'center';
        li.style.marginBottom = '6px';
        li.innerHTML = `<span>${f.question}</span><button data-index="${i}" class="btn btn-primary" style="font-size:0.8rem; margin-left:4px;">Delete</button>`;
        const delBtn = li.querySelector('button');
        delBtn.addEventListener('click', () => {
            faqs.splice(i, 1);
            saveFAQs();
            renderFAQList();
            renderFAQAccordion();
        });
        list.appendChild(li);
    });
}
function renderFAQAccordion() {
    const container = document.getElementById('faq-accordion');
    if (!container) return;
    container.innerHTML = '';
    faqs.forEach((f, i) => {
        const item = document.createElement('div');
        item.className = 'faq-item';
        item.dataset.category = f.category;
        const q = document.createElement('h3');
        q.className = 'faq-question';
        q.innerText = f.question;
        const a = document.createElement('div');
        a.className = 'faq-answer';
        a.innerHTML = `<p>${f.answer}</p>`;
        item.appendChild(q);
        item.appendChild(a);
        container.appendChild(item);
    });
    // Accordion toggle
    const questions = document.querySelectorAll('.faq-item .faq-question');
    questions.forEach(q => {
        q.addEventListener('click', () => {
            q.parentNode.classList.toggle('active');
        });
    });
    // Filter buttons (reuse existing listeners if already attached)
    const filterBtns = document.querySelectorAll('.faq-filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const cat = btn.dataset.category;
            const items = document.querySelectorAll('.faq-item');
            items.forEach(it => {
                const show = cat === 'all' || it.dataset.category === cat;
                it.style.display = show ? 'block' : 'none';
            });
        });
    });
}
// Admin Add FAQ handler
const addFAQBtn = document.getElementById('admin-add-faq');
if (addFAQBtn) {
    addFAQBtn.addEventListener('click', () => {
        const question = document.getElementById('admin-faq-question').value.trim();
        const answer = document.getElementById('admin-faq-answer').value.trim();
        const category = document.getElementById('admin-faq-category').value;
        if (!question || !answer) {
            alert('Provide both question and answer');
            return;
        }
        faqs.push({ question, answer, category });
        saveFAQs();
        renderFAQList();
        renderFAQAccordion();
        document.getElementById('admin-faq-question').value = '';
        document.getElementById('admin-faq-answer').value = '';
    });
}
// Initialize FAQ data
loadFAQs();
renderFAQList();
renderFAQAccordion();

    // Initial load
    loadProjects();
    renderPortfolioGrid();

    /* ==========================================
       1. NAVIGATION & SCROLL HANDLERS
       ========================================== */
    const header = document.getElementById('site-header');
    const menuToggle = document.getElementById('menu-toggle-btn');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    
    // Header background change on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Highlight active nav item on scroll
        highlightNavOnScroll();
    });
    
    // Toggle Mobile Menu
    if (menuToggle && mobileOverlay) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileOverlay.classList.toggle('active');
            
            // Toggle hamburger animation
            const bars = menuToggle.querySelectorAll('.bar');
            if (menuToggle.classList.contains('active')) {
                bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });
    }
    
    // Close Mobile Menu on Link Click
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileOverlay.classList.contains('active')) {
                menuToggle.click();
            }
        });
    });

    // Smooth scroll and active state highlight
    function highlightNavOnScroll() {
        let scrollPosition = window.scrollY + 200;
        
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    /* ==========================================
       2. PORTFOLIO FILTER & LIGHTBOX MODAL
       ========================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item-card');
    const globalLightbox = document.getElementById('global-lightbox');
    const lightboxImg = document.getElementById('lightbox-img-element');
    const lightboxTag = document.getElementById('lightbox-tag-field');
    const lightboxTitle = document.getElementById('lightbox-title-field');
    const closeLightbox = document.getElementById('close-lightbox');
    const prevLightboxBtn = document.getElementById('lightbox-prev');
    const nextLightboxBtn = document.getElementById('lightbox-next');
    
    let activeFilterItems = [...portfolioItems];
    let currentImgIndex = 0;

    // Filter Logic
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Toggle active class on buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            activeFilterItems = [];
            
            portfolioItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                // Hide and show items with smooth transitions
                if (filterValue === 'all' || itemCategory === filterValue) {
                    item.style.display = 'block';
                    // Retrigger animation
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.9) translateY(10px)';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1) translateY(0)';
                        item.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                    }, 50);
                    activeFilterItems.push(item);
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Lightbox Open Handler
    portfolioItems.forEach(card => {
        card.addEventListener('click', () => {
            const cardImgSrc = card.querySelector('.portfolio-image').getAttribute('src');
            const cardTitleText = card.querySelector('.portfolio-item-title').innerText;
            const cardTagText = card.querySelector('.portfolio-tag').innerText;
            
            // Set active index based on the currently filtered items list
            currentImgIndex = activeFilterItems.indexOf(card);
            
            openLightboxViewer(cardImgSrc, cardTitleText, cardTagText);
        });
    });

    function openLightboxViewer(src, title, tag) {
        lightboxImg.setAttribute('src', src);
        lightboxTitle.innerText = title;
        lightboxTag.innerText = tag;
        
        globalLightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Stop scrolling background
    }

    // Lightbox Close Handler
    if (closeLightbox) {
        closeLightbox.addEventListener('click', closeLightboxViewer);
    }
    
    // Close lightbox on click outside the image
    globalLightbox.addEventListener('click', (e) => {
        if (e.target === globalLightbox) {
            closeLightboxViewer();
        }
    });
    
    function closeLightboxViewer() {
        globalLightbox.classList.remove('active');
        document.body.style.overflow = 'auto'; // Re-enable scroll
    }

    // Lightbox Navigations
    function navigateLightbox(direction) {
        if (activeFilterItems.length <= 1) return;
        
        if (direction === 'next') {
            currentImgIndex = (currentImgIndex + 1) % activeFilterItems.length;
        } else {
            currentImgIndex = (currentImgIndex - 1 + activeFilterItems.length) % activeFilterItems.length;
        }
        
        const nextCard = activeFilterItems[currentImgIndex];
        const newSrc = nextCard.querySelector('.portfolio-image').getAttribute('src');
        const newTitle = nextCard.querySelector('.portfolio-item-title').innerText;
        const newTag = nextCard.querySelector('.portfolio-tag').innerText;
        
        // Dynamic fade transition inside lightbox
        lightboxImg.style.opacity = '0';
        setTimeout(() => {
            lightboxImg.setAttribute('src', newSrc);
            lightboxTitle.innerText = newTitle;
            lightboxTag.innerText = newTag;
            lightboxImg.style.opacity = '1';
            lightboxImg.style.transition = 'opacity 0.25s ease';
        }, 150);
    }

    if (nextLightboxBtn) nextLightboxBtn.addEventListener('click', () => navigateLightbox('next'));
    if (prevLightboxBtn) prevLightboxBtn.addEventListener('click', () => navigateLightbox('prev'));

    // Keyboard controls for lightbox
    document.addEventListener('keydown', (e) => {
        if (!globalLightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightboxViewer();
        if (e.key === 'ArrowRight') navigateLightbox('next');
        if (e.key === 'ArrowLeft') navigateLightbox('prev');
    });


    /* ==========================================
       3. INTERACTIVE PAYMENT SYSTEM & MODAL
       ========================================== */
    const paymentCards = document.querySelectorAll('.payment-card');
    const paymentModal = document.getElementById('payment-modal');
    const closePaymentModalBtn = document.getElementById('close-payment-modal');
    const modalContentArea = document.getElementById('modal-content-area');

    // Secure local payment records (No placeholders!)
    const paymentDetails = {
        skrill: {
            name: "Skrill Wallet",
            logo: "S",
            badge: "International Preferred",
            color: "var(--color-skrill)",
            data: [
                { label: "Receiver Email Address", value: "sifatmahmud485@gmail.com" },
                { label: "Preferred Currency", value: "USD / EUR / GBP" }
            ],
            note: "Copy the email address above and send your transaction. Once completed, please send a screenshot of the payment slip via WhatsApp."
        },
        bkash: {
            name: "bKash Mobile Wallet",
            logo: "b",
            badge: "Personal Wallet",
            color: "var(--color-bkash)",
            data: [
                { label: "bKash Mobile Number", value: "01785256367" },
                { label: "Account Type", value: "Personal Wallet (Send Money / Cash-In)" }
            ],
            note: "Please use 'Send Money' to the number listed above. Remember to enter your name or invoice number in the reference field!"
        },
        nagad: {
            name: "Nagad Mobile Wallet",
            logo: "N",
            badge: "Personal Wallet",
            color: "var(--color-nagad)",
            data: [
                { label: "Nagad Mobile Number", value: "01785256367" },
                { label: "Account Type", value: "Personal Wallet (Send Money)" }
            ],
            note: "Please send local payments directly to the number above. Text me on WhatsApp once the payment transaction is completed."
        },
        bank: {
            name: "Direct Bank Transfer",
            logo: "🏦",
            badge: "Direct Bank Account",
            color: "var(--color-bank)",
            data: [
                { label: "Bank Name", value: "Islami Bank Bangladesh PLC (IBBL)" },
                { label: "Account Holder Name", value: "SIFAT ULLAH" },
                { label: "Account Number", value: "20502120202947214" },
                { label: "Branch Location", value: "Chittagong, Bangladesh" },
                { label: "Routing Number", value: "125150935" }
            ],
            note: "Direct bank transfer takes 1-2 business days to clear. Please send the digital deposit receipt to confirm your design project launch."
        }
    };

    // Open Payment Modal
    paymentCards.forEach(card => {
        card.addEventListener('click', () => {
            const method = card.getAttribute('data-method');
            const data = paymentDetails[method];
            
            if (data) {
                renderPaymentModal(data);
                paymentModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Close Payment Modal
    if (closePaymentModalBtn) {
        closePaymentModalBtn.addEventListener('click', closePaymentModal);
    }
    
    paymentModal.addEventListener('click', (e) => {
        if (e.target === paymentModal) {
            closePaymentModal();
        }
    });

    function closePaymentModal() {
        paymentModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Render Modal Data Dynamically
    function renderPaymentModal(item) {
        let fieldsHtml = '';
        
        item.data.forEach((field, i) => {
            fieldsHtml += `
                <div class="modal-data-row">
                    <span class="modal-data-label">${field.label}</span>
                    <div class="modal-data-value-box">
                        <span class="modal-data-value" id="copy-field-${i}">${field.value}</span>
                        <button class="btn-copy-modal" onclick="copyToClipboard('copy-field-${i}', this)">Copy</button>
                    </div>
                </div>
            `;
        });

        modalContentArea.innerHTML = `
            <div class="modal-header-block">
                <div class="modal-logo-icon" style="color: ${item.color}; border-color: ${item.color}33; background-color: ${item.color}0a;">
                    ${item.logo}
                </div>
                <h3 class="modal-title">${item.name}</h3>
                <span class="payment-badge-status" style="background-color: ${item.color}26; color: ${item.color}; margin-top: 8px; display: inline-block;">
                    ${item.badge}
                </span>
            </div>
            <div class="modal-info-panel">
                ${fieldsHtml}
            </div>
            <p class="modal-help-note">${item.note}</p>
        `;
    }

    // Global copy to clipboard function inside window scope for modal click
    window.copyToClipboard = function(elementId, btnElement) {
        const textToCopy = document.getElementById(elementId).innerText;
        
        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalText = btnElement.innerText;
            btnElement.innerText = "✓ Copied!";
            btnElement.style.color = "#00FF00";
            
            setTimeout(() => {
                btnElement.innerText = originalText;
                btnElement.style.color = "var(--accent)";
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy details: ', err);
        });
    };


    /* ==========================================
       4. CLIENT ONBOARDING & PRICING CALCULATOR
       ========================================== */
    const orderForm = document.getElementById('project-order-form');
    const serviceSelector = document.getElementById('service-type');
    const scaleSlider = document.getElementById('project-scale');
    const scaleLabel = document.getElementById('scale-indicator-label');
    const costHUD = document.getElementById('cost-estimate-hud-display');
    const radioCards = document.querySelectorAll('.radio-card');
    
    // Dynamic Pricing Calculator
    function calculateEstimatedCost() {
        const selectedOption = serviceSelector.options[serviceSelector.selectedIndex];
        const basePrice = parseFloat(selectedOption.getAttribute('data-base-price'));
        const quantity = parseInt(scaleSlider.value);
        
        const total = basePrice * quantity;
        
        // Update Label
        scaleLabel.innerText = `${quantity} ${quantity > 1 ? 'Items' : 'Item'}`;
        
        // Update Price HUD
        costHUD.innerText = `$${total.toFixed(2)}`;
    }

    if (serviceSelector && scaleSlider) {
        serviceSelector.addEventListener('change', calculateEstimatedCost);
        scaleSlider.addEventListener('input', calculateEstimatedCost);
        
        // Initialize calculation once
        calculateEstimatedCost();
    }

    // Handle Custom Form Radio buttons (WhatsApp vs Telegram selection)
    radioCards.forEach(card => {
        card.addEventListener('click', () => {
            radioCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            
            const radioInput = card.querySelector('input');
            radioInput.checked = true;
        });
    });

    // Form Submission / Simple Message Compilation
    if (orderForm) {
        orderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('client-name').value.trim();
            const brand = document.getElementById('client-brand').value.trim();
            const serviceText = serviceSelector.options[serviceSelector.selectedIndex].text;
            const quantity = scaleSlider.value;
            const price = costHUD.innerText;
            const details = document.getElementById('project-details').value.trim();
            const contactMethod = document.querySelector('input[name="contact_method"]:checked').value;
            // Build concise summary
            let summary = `Project Order Summary:\nClient: ${name}`;
            if (brand) summary += `\nBrand: ${brand}`;
            summary += `\nService: ${serviceText}`;
            summary += `\nQuantity: ${quantity}`;
            summary += `\nEstimated Cost: ${price}`;
            summary += `\nDetails: ${details}`;
            summary += `\nContact Email: sifatmahmud485@gmail.com`;
            // Copy summary to clipboard and redirect
            if (contactMethod === 'whatsapp') {
                const waUrl = `https://wa.me/8801785256367?text=${encodeURIComponent(summary)}`;
                window.open(waUrl, '_blank');
            } else {
                const tgUrl = `https://t.me/sifatonline2026`;
                window.open(tgUrl, '_blank');
            }
            alert(`Project Order Summary:\n${summary}\nWe will contact you via ${contactMethod}.`);
        });
    }
    // Mouse dot follows cursor
    document.addEventListener('mousemove', (e) => {
        const dot = document.querySelector('.mouse-dot');
        if (dot) {
            dot.style.left = `${e.clientX}px`;
            dot.style.top = `${e.clientY}px`;
        }
    });

    /* =========================================
       NEW ENHANCEMENTS (Antigravity & Animations)
       ========================================= */

    // 1. Antigravity Particle Canvas
    const canvas = document.getElementById('antigravity-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray = [];
        const numberOfParticles = 140; 
        const colors = ['#4285f4', '#34a853', '#ea4335', '#fbbc05', '#a78bfa', '#FF6B00'];

        const mouse = { x: null, y: null, radius: 120 };

        window.addEventListener('mousemove', function(event) {
            mouse.x = event.x;
            mouse.y = event.y;
        });

        window.addEventListener('mouseout', function() {
            mouse.x = null;
            mouse.y = null;
        });

        window.addEventListener('resize', function() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        });

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2.5 + 1; 
                this.speedX = (Math.random() * 0.6) - 0.3;
                this.speedY = (Math.random() * 0.4) - 0.3; 
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.baseOpacity = Math.random() * 0.4 + 0.3;
                this.opacity = this.baseOpacity;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x < 0 || this.x > canvas.width) this.speedX = -this.speedX;
                if (this.y < 0 || this.y > canvas.height) this.speedY = -this.speedY;

                if (mouse.x != null && mouse.y != null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < mouse.radius) {
                        let forceDirectionX = dx / distance;
                        let forceDirectionY = dy / distance;
                        let maxForce = (mouse.radius - distance) / mouse.radius;
                        let force = maxForce * 2; 

                        this.x -= forceDirectionX * force;
                        this.y -= forceDirectionY * force;
                        this.opacity = 0.9; 
                    } else {
                        if (this.opacity > this.baseOpacity) this.opacity -= 0.02;
                    }
                }
            }
            draw() {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 8;
                ctx.shadowColor = this.color;
                ctx.fill();
                ctx.restore();
            }
        }

        function initParticles() {
            particlesArray = [];
            for (let i = 0; i < numberOfParticles; i++) {
                particlesArray.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.fillStyle = 'rgba(11, 11, 11, 0.2)'; // blend with var(--bg-dark)
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
                particlesArray[i].draw();
            }
            requestAnimationFrame(animateParticles);
        }

        initParticles();
        animateParticles();
    }

    // 2. Typewriter Effect
    const typeWriterEl = document.querySelector('.typewriter-text');
    if (typeWriterEl) {
        const words = ["Graphic Designer", "Visual Creator", "Brand Designer"];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        function type() {
            const currentWord = words[wordIndex];
            if (isDeleting) {
                typeWriterEl.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typeWriterEl.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }
            
            let typeSpeed = isDeleting ? 50 : 100;
            
            if (!isDeleting && charIndex === currentWord.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 500;
            }
            
            setTimeout(type, typeSpeed);
        }
        type();
    }

    // 3. Stats Count-Up Animation
    const statsSection = document.getElementById('stats');
    const statNumbers = document.querySelectorAll('.stat-number');
    let hasCounted = false;

    if (statsSection && statNumbers.length > 0) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !hasCounted) {
                hasCounted = true;
                statNumbers.forEach(el => {
                    const text = el.textContent;
                    const finalNum = parseInt(text.replace(/[^0-9]/g, ''));
                    const hasPlus = text.includes('+');
                    const hasPercent = text.includes('%');
                    
                    if (!isNaN(finalNum)) {
                        let current = 0;
                        const increment = Math.ceil(finalNum / 50);
                        const timer = setInterval(() => {
                            current += increment;
                            if (current >= finalNum) {
                                current = finalNum;
                                clearInterval(timer);
                            }
                            el.innerHTML = `<span class="${hasPlus ? 'highlight-orange' : ''}">${current}${hasPlus ? '+' : ''}${hasPercent ? '%' : ''}</span>`;
                        }, 30);
                    }
                });
            }
        });
        statsObserver.observe(statsSection);
    }

    // 4. Testimonials Carousel
    const testimonialsData = [
        { text: "Sifat transformed our entire brand. The attention to detail is stunning!", author: "- CEO, TechFlow" },
        { text: "His thumbnails boosted our CTR by 40%. Incredible graphic designer.", author: "- Content Creator" },
        { text: "Very responsive and the packaging design was top-tier.", author: "- Marketing Lead, Foodies" }
    ];
    const tTrack = document.getElementById('testimonials-track');
    const tDotsContainer = document.getElementById('testimonials-dots');
    if (tTrack && tDotsContainer) {
        testimonialsData.forEach((t, index) => {
            const div = document.createElement('div');
            div.className = 'testimonial-card';
            div.innerHTML = `<p class="testimonial-text">"${t.text}"</p><p class="testimonial-author">${t.author}</p>`;
            tTrack.appendChild(div);
            
            const dot = document.createElement('div');
            dot.className = `dot ${index === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => {
                tTrack.style.transform = `translateX(-${index * 100}%)`;
                document.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));
                dot.classList.add('active');
            });
            tDotsContainer.appendChild(dot);
        });
    }

    // 5. Toast notification logic update for forms
    function showToast(msg) {
        const toast = document.getElementById('toast-msg');
        if (toast) {
            toast.textContent = msg;
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
    }
    
    // override the form submit alert to use Toast instead
    const orderForm = document.getElementById('project-order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', (e) => {
            showToast("Redirecting to chat...");
        });
    }

    // 6. Preloader Logic
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
            }, 1500); // play the logo animation for 1.5s
        });
    }

    // 7. Dark/Light Theme Toggle
    const themeToggleBtn = document.getElementById('theme-toggle');
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    
    // Check saved theme
    if (localStorage.getItem('sifat_theme') === 'light') {
        document.body.classList.add('light-mode');
        if (sunIcon && moonIcon) {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        }
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            const isLight = document.body.classList.contains('light-mode');
            
            if (isLight) {
                localStorage.setItem('sifat_theme', 'light');
                sunIcon.style.display = 'none';
                moonIcon.style.display = 'block';
            } else {
                localStorage.setItem('sifat_theme', 'dark');
                sunIcon.style.display = 'block';
                moonIcon.style.display = 'none';
            }
        });
    }

    // 8. FAQ Accordion Logic
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        questionBtn.addEventListener('click', () => {
            // Close other open items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            // Toggle clicked item
            item.classList.toggle('active');
        });
    });

});
