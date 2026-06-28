
const gtagScript = document.createElement('script');
gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-T0J09QNZ7J';
gtagScript.async = true;
document.head.appendChild(gtagScript);

window.dataLayer = window.dataLayer || [];
function gtag(){ dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'G-T0J09QNZ7J');

const fbPixelScript = document.createElement('script');
fbPixelScript.innerHTML = `
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '1011547961834822');
  fbq('track', 'PageView');
`;
document.head.appendChild(fbPixelScript);

const noscriptPixel = document.createElement('noscript');
noscriptPixel.innerHTML = `<img height="1" width="1" style="display:none"
  src="https://www.facebook.com/tr?id=1011547961834822&ev=PageView&noscript=1" />`;
document.body.appendChild(noscriptPixel);

window.trackEvent = function(eventName, params = {}) {
    if (typeof gtag === 'function') gtag('event', eventName, params);
    if (typeof fbq === 'function') fbq('track', eventName, params);
};

gsap.registerPlugin(ScrollTrigger);

const supabaseUrl = 'https://woohnwokwxlakvhtnyxa.supabase.co';
const supabaseKey = 'sb_publishable_GfY7g964Pi2i1PhhQktWqw_1qbY82cX'; 
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

const supabaseGestUrl = 'https://kqlzvczfxzlkcxziapin.supabase.co';        
const supabaseGestKey = 'sb_publishable_B7b1OPGP0L-KZR7Q-7_Iog_c2X6KbIm';   
const _supabaseGest = supabase.createClient(supabaseGestUrl, supabaseGestKey);


const urlParams = new URLSearchParams(window.location.search);
const msgFromUrl = urlParams.get('msg');

if (msgFromUrl && document.getElementById('contact-message')) {
    document.getElementById('contact-message').value = msgFromUrl;
    setTimeout(() => {
        const target = document.getElementById('contact');
        if(target) target.scrollIntoView({ behavior: 'smooth' });
    }, 500);
}

document.addEventListener("DOMContentLoaded", () => {
  
    const burger = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav-links");
const overlay = document.getElementById("menu-overlay");
const navLinksItems = document.querySelectorAll(".nav-links li a");

if (burger && nav && overlay) {
    burger.onclick = (e) => {
        e.stopPropagation();
        const isOpening = !nav.classList.contains("nav-active");
        
        nav.classList.toggle("nav-active");
        overlay.classList.toggle("active");
        document.body.style.overflow = nav.classList.contains("nav-active") ? "hidden" : "auto";

        if (isOpening) {
            gsap.fromTo(".nav-links.nav-active", 
                { y: -30, opacity: 0 }, 
                { y: 0, opacity: 1, duration: 0.4, ease: "back.out(0.8)" }
            );
        }
    };

    overlay.onclick = () => {
        nav.classList.remove("nav-active");
        overlay.classList.remove("active");
        document.body.style.overflow = "auto";
    };

    navLinksItems.forEach(link => {
        link.onclick = () => {
            nav.classList.remove("nav-active");
            overlay.classList.remove("active");
            document.body.style.overflow = "auto";
        };
    });
}
 
if (document.querySelector(".hero-title")) {
    const tl = gsap.timeline({ delay: 0.5 });
    tl.to(".hero-title .anim-text", {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.3,
        ease: "power4.out"
    })
    .to(".hero-subtitle", {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out"
    }, "-=0.8"); 
}


function setNoCursor() {
    document.querySelectorAll('*').forEach(el => el.style.cursor = 'none');
}
setNoCursor();
new MutationObserver(setNoCursor).observe(document.body, { childList: true, subtree: true });


    
    const slides = document.querySelectorAll(".hero-bg");
    let currentSlide = 0;
    if (slides.length > 0) {
        slides[0].classList.add("active");
        setInterval(() => {
            slides[currentSlide].classList.remove("active");
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add("active");
        }, 5000);
    }
    
 
    const yearElement = document.getElementById('counter-year');
    if (yearElement) {
        ScrollTrigger.create({
            trigger: ".massive-year",
            start: "top 70%",
            onEnter: () => {
                let startValue = 18;
                let endValue = 26;
                let duration = 2000;
                let startTime = null;

                function animate(currentTime) {
                    if (!startTime) startTime = currentTime;
                    let progress = currentTime - startTime;
                    let currentNumber = Math.min(Math.floor((progress / duration) * (endValue - startValue) + startValue), endValue);
                    yearElement.innerText = currentNumber;
                    if (progress < duration) requestAnimationFrame(animate);
                }
                requestAnimationFrame(animate);
                document.querySelector(".massive-year").classList.add("filled");
            }
        });
    }

    
    gsap.utils.toArray(".scroll-trigger-anim").forEach(elem => {
        gsap.fromTo(elem,
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                scrollTrigger: {
                    trigger: elem,
                    start: "top 85%"
                }
            }
        );
    });


   document.querySelectorAll(".pillar").forEach(pillar => {
    pillar.addEventListener("click", (e) => {
        if (e.target.closest(".plans-dropdown")) return;
        
        const dropdown = pillar.querySelector(".plans-dropdown");
        const allPillars = document.querySelectorAll('.pillar');
        const isActive = pillar.classList.contains("active");

        allPillars.forEach(p => {
            p.classList.remove("active");
            const d = p.querySelector(".plans-dropdown");
            if(d) {
                d.style.height = "0px";
                d.style.overflow = "hidden"; 
            }
        });

        if (!isActive) {
            pillar.classList.add("active");
            if(dropdown) {
               
                dropdown.style.height = "auto"; 
                dropdown.style.maxHeight = "70vh";
                dropdown.style.overflowY = "auto"; 
                
                setTimeout(() => {
                    pillar.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 300);
            }
        }
    });
});
    
document.querySelectorAll('.plan-header').forEach(header => {
    header.addEventListener('click', (e) => {
        e.stopPropagation(); 

        const currentItem = header.parentElement;
        const parentDropdown = currentItem.closest('.plans-dropdown');
        
        const siblingItems = currentItem.parentElement.querySelectorAll('.plan-item');
        siblingItems.forEach(item => {
            if(item !== currentItem) item.classList.remove('active');
        });
        currentItem.classList.toggle('active');

if (parentDropdown) {
    parentDropdown.style.height = "auto";
    parentDropdown.style.overflowY = "auto";
}
    });
});


    
    const lightbox = document.getElementById('project-lightbox');
    const lbImg = document.getElementById('lb-img');
    const lbVid = document.getElementById('lb-vid');
    const btnPrev = document.getElementById('lb-prev');
    const btnNext = document.getElementById('lb-next');
    
    let currentMediaList = []; 
    let currentMediaIndex = 0; 

 
    function playAllVideos() {
        document.querySelectorAll('video').forEach(v => {
            v.muted = true; 
            v.play().catch(() => {
                v.controls = false; 
            });
        });
    }

function renderProjects(projets) {
    const container = document.getElementById('projects-container');
    if (!container) return;

    container.innerHTML = projets.map(proj => {
        const hasVideo = proj.video_url;
        
        return `
            <div class="project-card scroll-trigger-anim">
                <div class="parallax-container" onclick="openLightbox('${proj.video_url || proj.image_url}', ${!!proj.video_url})">
                    ${hasVideo 
                        ? `<video src="${proj.video_url}" muted loop playsinline preload="metadata" class="parallax-img project-video"></video>` 
                        : `<img src="${proj.image_url}" loading="lazy" class="parallax-img" alt="${proj.title}">`
                    }
                </div>
                <div class="project-info">
                    <span class="category">${proj.category.toUpperCase()}</span>
                    <h3>${proj.title} <i class="fas fa-expand"></i></h3>
                    <p style="font-size:0.8rem; color:#aaa; margin-top:5px;">${proj.description || ''}</p>
                </div>
            </div>
        `;
    }).join('');
    initVideoObserver();

    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}




function initProjectSlider() {
    new Swiper(".projects-swiper", {
        slidesPerView: 1,
        spaceBetween: 20,
        slidesPerGroup: 1,
        loop: data.length > 3, 
        autoplay: { delay: 4000 },
        pagination: { el: ".swiper-pagination", clickable: true },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        breakpoints: {
            768: { slidesPerView: 2, slidesPerGroup: 2 },
            1024: { slidesPerView: 3, slidesPerGroup: 3 } 
        }
    });
}




function openLightbox(url, isVideo) {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return; 

    const lbImg = lightbox.querySelector('.lightbox-img');
    const lbVid = lightbox.querySelector('.lightbox-video');

    if (isVideo && lbVid) {
        if(lbImg) lbImg.style.display = 'none';
        lbVid.src = url;
        lbVid.style.display = 'block';
        lbVid.play();
    } else if (lbImg) {
        if(lbVid) {
            lbVid.style.display = 'none';
            lbVid.pause();
        }
        lbImg.src = url;
        lbImg.style.display = 'block';
    }
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('close-lightbox') || e.target.closest('.close-lightbox')) {
        const lb = document.getElementById('lightbox');
        if (lb) lb.classList.remove('active');
        
        const vid = document.querySelector('.lightbox-video');
        if (vid && typeof vid.pause === "function") {
            vid.pause();
        }
        document.body.style.overflow = 'auto';
    }
});



    
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('.btn-submit');
            btn.innerText = "ENVOI EN COURS...";
            btn.disabled = true;

            const formData = {
                nom: document.getElementById('contact-nom').value,
                email: document.getElementById('contact-email').value,
                telephone: document.getElementById('contact-tel').value,
                categorie: document.getElementById('contact-category').value,
                message: document.getElementById('contact-message').value
            };

            const { error } = await _supabase
                .from('contacts')
                .insert([formData]);

            if (error) {
    console.error(error);
    alert("Erreur lors de l'envoi. Veuillez réessayer.");
    btn.innerText = "RÉESSAYER";
    btn.disabled = false;
} else {
    alert("Message envoyé avec succès ! Merci de nous avoir contactés.");
    contactForm.reset();
    btn.innerText = "ENVOYER LE MESSAGE";
    btn.disabled = false;
    window.trackEvent('Lead', { content_name: 'Formulaire contact' });
    window.trackEvent('Contact', { content_name: 'Formulaire envoyé' });
}
        });
    }
    function initBeforeAfter() {
    const containers = document.querySelectorAll('.before-after-container');
    
    containers.forEach(container => {
        const wrapper = container.querySelector('.img-before-wrapper');
        const slider = container.querySelector('.comparison-slider');

        const move = (e) => {
            let x;
            if (e.type === 'touchmove') {
                x = e.touches[0].clientX - container.getBoundingClientRect().left;
            } else {
                x = e.offsetX;
            }
            
            let width = container.offsetWidth;
            if (x < 0) x = 0;
            if (x > width) x = width;
            
            let percent = (x / width) * 100;
            wrapper.style.width = percent + "%";
            slider.style.left = percent + "%";
        };

        container.addEventListener('mousemove', move);
        container.addEventListener('touchmove', move);
    });
}

    initBeforeAfter();
   
const estCategory = document.getElementById('est-category');
const estSurface = document.getElementById('est-surface');
const finalPriceDisplay = document.getElementById('final-price');
const rangeBtns = document.querySelectorAll('.range-btn');

let currentRange = "standard";


const prices = {
    construction: { standard: 350000, premium: 550000 },
    finition: { standard: 45000, premium: 85000 },      
    technique: { standard: 150000, premium: 300000 }   
};

function calculatePrice() {
    const category = estCategory.value;
    const surface = parseFloat(estSurface.value) || 0;
    
    let basePrice = prices[category][currentRange];
    let total = basePrice * surface;

    const formatter = new Intl.NumberFormat('fr-FR');
    finalPriceDisplay.innerText = formatter.format(total) + " FCFA";
}

if (estCategory) {
    estCategory.addEventListener('change', calculatePrice);
    estSurface.addEventListener('input', calculatePrice);

    rangeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            rangeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentRange = btn.getAttribute('data-range');
            calculatePrice();
        });
    });

    document.getElementById('send-estimate').addEventListener('click', () => {
    const categoryText = estCategory.options[estCategory.selectedIndex].text;
    const surface = estSurface.value;
    const message = `Bonjour, je souhaite un devis détaillé pour un projet de ${categoryText} d'environ ${surface} m2 en finition ${currentRange}.`;

    const contactForm = document.getElementById('contact');
    
    if (contactForm) {
        document.getElementById('contact-message').value = message;
        document.getElementById('contact-category').value = estCategory.value === 'construction' ? 'batiment' : estCategory.value;
        contactForm.scrollIntoView({ behavior: 'smooth' });
    } else {
        const encodedMsg = encodeURIComponent(message);
        window.location.href = `../index.html?msg=${encodedMsg}#contact`;
    }
});
}

const newsForm = document.getElementById('newsletter-form');
if (newsForm) {
    newsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const emailInput = document.getElementById('news-email');
        const feedback = document.getElementById('news-feedback');
        const btn = newsForm.querySelector('button');

        btn.disabled = true;
        btn.innerText = "...";

        const email = emailInput.value.trim();

       
        const { data: existing } = await _supabase
            .from('newsletter')
            .select('email')
            .eq('email', email);

        if (existing && existing.length > 0) {
            feedback.style.display = 'block';
            feedback.innerText = "Vous êtes déjà inscrit !";
            btn.disabled = false;
            btn.innerText = "S'ABONNER";
            return;
        }

        const { error } = await _supabase
            .from('newsletter')
            .insert([{ email: email }]);

        feedback.style.display = 'block';
        
        if (error) {
            feedback.innerText = "Erreur, veuillez réessayer.";
            feedback.style.color = "red";
        } else {
            feedback.innerText = "Inscription réussie ! Bienvenue.";
            feedback.style.color = "var(--accent-color)";
            emailInput.value = "";
            window.trackEvent('Subscribe', { content_name: 'Newsletter' });

        }
        
        btn.disabled = false;
        btn.innerText = "S'ABONNER";
    });
}
});

document.addEventListener("DOMContentLoaded", () => {

    const chatTrigger = document.getElementById('chat-trigger');
    const chatWidget = document.getElementById('chat-widget');
    const closeChat = document.getElementById('close-chat');
    const chatInput = document.getElementById('chat-input');
    const sendChat = document.getElementById('send-chat');
    const messagesContainer = document.getElementById('chat-messages');
    const chatBadge = document.getElementById('chat-badge');
    const msgSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3');

    if (!chatTrigger || !chatWidget) return;
    function getSessionId() {
    let sessionId = localStorage.getItem('chat_session_id');
    if (!sessionId) {
        sessionId = Math.random().toString(36).substring(7);
        localStorage.setItem('chat_session_id', sessionId);
        document.cookie = `chat_session_id=${sessionId}; path=/; max-age=31536000`;
    }
    return sessionId;
}
    let sessionId = localStorage.getItem('chat_session_id');
    let clientName = localStorage.getItem('chat_client_name');

    if (!sessionId) {
        sessionId = Math.random().toString(36).substring(7);
        localStorage.setItem('chat_session_id', sessionId);
    }

    function showNamePrompt() {
    chatInput.style.display = 'none';
    sendChat.style.display = 'none';

    const formDiv = document.createElement('div');
    formDiv.id = 'name-form-container';
    formDiv.style.padding = '20px';
    formDiv.style.textAlign = 'center';
    formDiv.innerHTML = `
        <p style="margin-bottom: 10px; color: #0066CC;">Pour commencer, veuillez entrer votre nom et prénom :</p>
        <input type="text" id="client-name-input" placeholder="Nom et prénom" style="width: 100%; padding: 8px; margin-bottom: 10px; border-radius: 20px; border: 1px solid #ccc;">
        <button id="submit-name-btn" class="btn-primary" style="padding: 8px 20px;">COMMENCER</button>
    `;
    messagesContainer.innerHTML = '';
    messagesContainer.appendChild(formDiv);

    document.getElementById('submit-name-btn').addEventListener('click', async () => {
        const nameInput = document.getElementById('client-name-input');
        const name = nameInput.value.trim();
        if (!name) return;

        clientName = name;
        localStorage.setItem('chat_client_name', clientName);

        const { error } = await _supabase.from('messages').insert([
            { content: `CLIENT_NAME:${clientName}`, sender_role: 'system', session_id: sessionId, client_name: clientName }
        ]);
        if (error) console.error("Erreur enregistrement nom:", error);

        const welcomeMsg = `Bonjour ${clientName} ! Bienvenue sur l'assistance BAT & PREFAB. Comment puis-je vous aider ?`;
        await _supabase.from('messages').insert([
            { content: welcomeMsg, sender_role: 'admin', session_id: sessionId, client_name: clientName }
        ]);

        chatInput.style.display = 'block';
        sendChat.style.display = 'block';
        messagesContainer.innerHTML = '';
        loadChatMessages();
    });
}

    async function loadChatMessages() {
        const { data, error } = await _supabase
            .from('messages')
            .select('*')
            .eq('session_id', sessionId)
            .order('created_at', { ascending: true });

        if (error) return;
        messagesContainer.innerHTML = '';
        data.forEach(msg => {
            const div = document.createElement('div');
            div.classList.add('msg', msg.sender_role);
            div.innerText = msg.content;
            messagesContainer.appendChild(div);
        });
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    async function checkNameExists() {
        if (clientName) {
            chatInput.style.display = 'block';
            sendChat.style.display = 'block';
            loadChatMessages();
        } else {
            const { data, error } = await _supabase
                .from('chat_sessions')
                .select('client_name')
                .eq('session_id', sessionId)
                .maybeSingle();

            if (data && data.client_name) {
                clientName = data.client_name;
                localStorage.setItem('chat_client_name', clientName);
                chatInput.style.display = 'block';
                sendChat.style.display = 'block';
                loadChatMessages();
            } else {
                showNamePrompt();
            }
        }
    }

    async function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;
        chatInput.value = '';

        const { error } = await _supabase.from('messages').insert([
            { content: text, sender_role: 'user', session_id: sessionId }
        ]);
        if (!error) {
            loadChatMessages();
        }
    }

    chatTrigger.addEventListener('click', () => {
        chatWidget.classList.toggle('chat-open');
        if (chatWidget.classList.contains('chat-open')) {
            checkNameExists();
        }
        chatBadge.style.display = 'none';
    });

    closeChat?.addEventListener('click', () => {
        chatWidget.classList.remove('chat-open');
    });

    sendChat?.addEventListener('click', sendMessage);
    chatInput?.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });

    _supabase
        .channel('public:messages')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
            if (payload.new.session_id === sessionId) {
                loadChatMessages();
                if (payload.new.sender_role === 'admin') {
                    msgSound.play().catch(() => {});
                    if (!chatWidget.classList.contains('chat-open')) {
                        chatBadge.style.display = 'block';
                    }
                }
            }
        })
        .subscribe();

    const dragHeader = document.getElementById("chat-header");
    let active = false, currentX, currentY, initialX, initialY, xOffset = 0, yOffset = 0;

    dragHeader?.addEventListener("mousedown", (e) => {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
        if (e.target === dragHeader || dragHeader.contains(e.target)) active = true;
    });

    document.addEventListener("mousemove", (e) => {
        if (active) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            xOffset = currentX;
            yOffset = currentY;
            chatWidget.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
        }
    });

    document.querySelectorAll('.btn-primary, .btn-secondary-outline, .btn-submit, .btn-plans-trigger, a[href^="tel:"], a[href^="mailto:"], a[href*="wa.me"], a[href*="whatsapp"], a[href="/contact"], a[href="#contact"], .social-icon, #chat-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
        let text = btn.innerText?.trim() || btn.href || 'Contact';
        window.trackEvent('Contact', { button_text: text.length > 100 ? text.substring(0,100) : text });
    });
});

    document.addEventListener("mouseup", () => active = false);
});

gsap.utils.toArray('.stat-number').forEach(num => {
    const target = parseInt(num.getAttribute('data-target'));
    
    gsap.to(num, {
        innerText: target,
        duration: 2,
        snap: { innerText: 1 }, 
        scrollTrigger: {
            trigger: num,
            start: "top 90%",
            toggleActions: "restart reverse restart reverse" 
        },
        onStart: () => { num.innerText = 0; }
    });
});
const WHATSAPP_NUMBER = "2250556121339";
let promoList = [];
let currentPromoIndex = 0;


(async function loadPromos() {
    const { data, error } = await _supabase
        .from('promotions')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

    if (error) {
        console.error(" Erreur Supabase :", error);
        return;
    }

    console.log(" Promotions brutes :", data);

    if (data && data.length > 0) {
        promoList = data;
        currentPromoIndex = 0;
        displayCurrentPromo();
        setTimeout(() => {
            openPromo();
        }, 2000);
    } else {
        console.log("ℹ Aucune promotion active trouvée");
    }
})();


function displayCurrentPromo() {
    if (promoList.length === 0) return;
    const p = promoList[currentPromoIndex];
    const container = document.getElementById('promo-body');
    if (!container) return;

    const now = Date.now();
    const fin = p.date_fin ? new Date(p.date_fin).getTime() : null;
    const isExpired = fin && fin < now;

    // ---- GÉNÉRATION DU MESSAGE WHATSAPP ----
    let customMessage = `Bonjour BAT & PREFAB, je suis intéressé par cette offre :\n\n*OFFRE :* ${p.title}`;
    if (!isExpired) {
        customMessage += `\n*DETAILS :* ${p.message}`;
    } else {
        customMessage = `Bonjour BAT & PREFAB, je souhaite en savoir plus sur vos prestations.`;
    }
    const waLink = `https://wa.me/2250556121339?text=${encodeURIComponent(customMessage)}`;

    let html = '';

    // 1. L'EN-TÊTE : Collé tout en haut, prend toute la largeur
    html += `
        <div class="promo-header-banner">
            <i class="fas fa-gift" style="margin-right: 8px; color: #FFC107;"></i> 
            Offre Spéciale
            <i class="fas fa-gift" style="margin-left: 8px; color: #FFC107;"></i>
        </div>
    `;

    // 2. ZONE CENTRALE : Prend l'espace restant et permet le défilement si le contenu est long
    html += `<div class="promo-scrollable-content">`;

    // ---- IMAGE ----
    html += `
        <div class="promo-image-wrapper" onclick="openPromoImage('${p.image_url}')">
            ${p.image_url ? `<img src="${p.image_url}" alt="${p.title}">` : ''}
        </div>
    `;

    // ---- LIGNE SOUS L'IMAGE : compte à rebours (gauche) + badge Promotion (droite) ----
    html += `<div class="promo-footer-row">`;

    if (fin && !isExpired && fin > now) {
        html += `
            <div class="promo-countdown" style="margin:0;">
                <i class="fas fa-clock"></i> 
                <span id="countdown-${p.id}"></span>
            </div>
        `;
    } else if (isExpired) {
        html += `
            <div class="promo-countdown" style="margin:0; color:#dc3545;">
                <i class="fas fa-exclamation-circle"></i> Offre expirée
            </div>
        `;
    } else {
        html += `<div class="promo-countdown" style="margin:0; visibility:hidden;">&nbsp;</div>`;
    }

    const badgeText = isExpired ? 'Terminé' : 'Promotion';
    html += `
        <span class="promo-badge-tag" style="background: linear-gradient(135deg, #FFC107, #FFA000); color: #fff; font-family: 'Oswald', sans-serif !important;">
            <i class="fas fa-fire"></i> ${badgeText}
        </span>
    `;

    html += `</div>`; // fin promo-footer-row

    // ---- TITRE, DESCRIPTION ET BOUTONS D'ACTION ----
    html += `
        <div class="promo-body-content">
            <h2 class="promo-title">${p.title}</h2>
            <div class="promo-description">${p.message}</div>
            <div class="promo-actions">
                <a href="${waLink}" target="_blank" class="btn-promo-wa ${isExpired ? 'disabled' : ''}" 
                   ${isExpired ? 'style="pointer-events:none; opacity:0.5;"' : ''}>
                    <i class="fab fa-whatsapp"></i> ${isExpired ? 'Offre expirée' : 'Obtenir l\'offre'}
                </a>
                <button onclick="sharePromo()" class="btn-promo-share ${isExpired ? 'disabled' : ''}"
                        ${isExpired ? 'disabled style="pointer-events:none; opacity:0.5;"' : ''}>
                    <i class="fas fa-share-alt"></i> Partager
                </button>
            </div>
        </div>
    `;

    html += `</div>`; // Fin de .promo-scrollable-content

    // 3. NAVIGATION : Poussée tout en bas
    html += `
        <div class="promo-nav">
            <button onclick="changePromo(-1)" ${promoList.length <= 1 ? 'disabled' : ''}>
                <i class="fas fa-chevron-left"></i>
            </button>
            <div class="promo-dots">
                ${promoList.map((_, i) => `
                    <button class="promo-dot ${i === currentPromoIndex ? 'active' : ''}" onclick="goToPromo(${i})" ${promoList.length <= 1 ? 'disabled' : ''}></button>
                `).join('')}
            </div>
            <button onclick="changePromo(1)" ${promoList.length <= 1 ? 'disabled' : ''}>
                <i class="fas fa-chevron-right"></i>
            </button>
        </div>
    `;

    // ---- INJECTION DANS LE DOM ----
    container.innerHTML = html;

    // ---- DÉMARRAGE DU COMPTE À REBOURS ----
    if (fin && !isExpired && fin > now) {
        const countdownElement = document.getElementById(`countdown-${p.id}`);
        if (countdownElement) {
            // Assurez-vous que votre fonction startCountdown() existe bien ailleurs dans votre script
            startCountdown(fin, countdownElement);
        }
    }
}

let touchStartX = 0;
let touchEndX = 0;

function setupPromoNavigationControls() {
    const overlay = document.getElementById('promo-overlay');
    const modal = document.querySelector('.promo-modal');
    if (!overlay || !modal) return;

    document.addEventListener('keydown', handleKeyboard);

    modal.addEventListener('touchstart', handleTouchStart, { passive: true });
    modal.addEventListener('touchmove', handleTouchMove, { passive: true });
    modal.addEventListener('touchend', handleTouchEnd, { passive: true });
}

function handleKeyboard(e) {
    const overlay = document.getElementById('promo-overlay');
    if (!overlay || !overlay.classList.contains('open')) return;
    if (e.key === 'ArrowLeft') {
        e.preventDefault();
        changePromo(-1);
    } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        changePromo(1);
    }
}

function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
}

function handleTouchMove(e) {
    touchEndX = e.changedTouches[0].screenX;
}

function handleTouchEnd(e) {
    const overlay = document.getElementById('promo-overlay');
    if (!overlay || !overlay.classList.contains('open')) return;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) < 50) return;
    if (diff > 0) {
        changePromo(1);
    } else {
        changePromo(-1);
    }
    touchStartX = 0;
    touchEndX = 0;
}

document.addEventListener('DOMContentLoaded', () => {
    setupPromoNavigationControls();
});

function startCountdown(endTime, element) {
    function update() {
        const now = Date.now();
        let diff = endTime - now;
        if (diff <= 0) {
            element.textContent = "Terminé !";
            return;
        }
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        element.textContent = `${days}j ${hours}h ${minutes}m ${seconds}s`;
    }
    update();
    setInterval(update, 1000);
}

window.changePromo = function(direction) {
    currentPromoIndex = (currentPromoIndex + direction + promoList.length) % promoList.length;
    displayCurrentPromo();
};

window.goToPromo = function(index) {
    currentPromoIndex = index;
    displayCurrentPromo();
};

window.openPromo = function() {
    const overlay = document.getElementById('promo-overlay');
    if (overlay) {
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
};

window.closePromo = function() {
    const overlay = document.getElementById('promo-overlay');
    if (overlay) {
        overlay.classList.remove('open');
        document.body.style.overflow = 'auto';
    }
};

window.sharePromo = async function() {
    const p = promoList[currentPromoIndex];
    const shareData = {
        title: `BAT & PREFAB : ${p.title}`,
        text: `${p.title} - ${p.message}`,
        url: window.location.href
    };
    try {
        if (navigator.share) {
            await navigator.share(shareData);
        } else {
            await navigator.clipboard.writeText(`${shareData.text} \nLien : ${shareData.url}`);
            alert("Lien copié dans le presse-papier !");
        }
    } catch (err) { /* annulation ou erreur */ }
};
/**
 * Ouvre l'image de la promotion en plein écran (lightbox)
 */
window.openPromoImage = function(url) {
    if (!url) return;

    // Créer l'overlay
    const overlay = document.createElement('div');
    overlay.id = 'promo-image-lightbox';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.92);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 100000;
        cursor: pointer;
        backdrop-filter: blur(4px);
    `;

    // L'image en grand
    const img = document.createElement('img');
    img.src = url;
    img.style.cssText = `
        max-width: 92%;
        max-height: 92%;
        object-fit: contain;
        border-radius: 12px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
        transition: transform 0.3s ease;
    `;
    img.alt = 'Agrandissement promotion';

    // Bouton fermeture
const closeBtn = document.createElement('span');
closeBtn.innerHTML = '&times;';
closeBtn.style.cssText = `
    position: absolute;
    top: 20px;
    right: 30px;
    font-size: 2.5rem;
    color: #fff;
    cursor: pointer;
    z-index: 100001;
    font-family: 'Montserrat', sans-serif;
    font-weight: 300;
    transition: transform 0.2s;
    text-shadow: 0 2px 10px rgba(0,0,0,0.5);
`;
closeBtn.addEventListener('mouseenter', () => closeBtn.style.transform = 'scale(1.2)');
closeBtn.addEventListener('mouseleave', () => closeBtn.style.transform = 'scale(1)');
closeBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    closePromoImage(overlay);
});
overlay.appendChild(closeBtn);
    overlay.appendChild(img);
    document.body.appendChild(overlay);

    // Empêcher le scroll derrière
    document.body.style.overflow = 'hidden';

    // Fermer en cliquant sur l'overlay (pas sur l'image)
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closePromoImage(overlay);
        }
    });

    // Fermer avec la touche Échap
    function keyHandler(e) {
        if (e.key === 'Escape') {
            closePromoImage(overlay);
            document.removeEventListener('keydown', keyHandler);
        }
    }
    document.addEventListener('keydown', keyHandler);

    // On peut aussi fermer en cliquant sur l'image elle-même si on veut
    // img.addEventListener('click', function(e) { e.stopPropagation(); });
};

/**
 * Ferme la lightbox de l'image promotion
 */
function closePromoImage(overlay) {
    if (overlay && overlay.parentNode) {
        overlay.remove();
        document.body.style.overflow = '';
    }
}


document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closePromo();
    }
});

document.querySelectorAll('.mini-slider').forEach(slider => {
    const track = slider.querySelector('.slider-track');
    const nextBtn = slider.querySelector('.next');
    const prevBtn = slider.querySelector('.prev');
    if(!track) return;
    const slides = Array.from(track.children);
    let currentIndex = 0;

    const updateSlider = () => {
        const amountToMove = slides[currentIndex].offsetWidth;
        track.style.transform = `translateX(-${currentIndex * amountToMove}px)`;
    };

    if(nextBtn && prevBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex + 1) % slides.length;
            updateSlider();
        });
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateSlider();
        });
    }
});


document.addEventListener("DOMContentLoaded", () => {
    const burger = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".nav-links");
    if (burger && nav) {
        burger.onclick = () => nav.classList.toggle("nav-active");
    }

});

const servicesData = {
    "prefabriques": {
        title: "PRÉFABRIQUÉS",
        banner: "../service/pre.jpg",
        desc: "Solutions de construction rapide pour bureaux, logements et infrastructures spécifiques.",
        subCategories: [
            {
                title: "Bâtiments administratifs",
                imgs: ["../service/img.jpg"],
                desc: `Des bâtiments administratifs de différents styles avec différentes configurations qui servent de locaux ou sièges aux institutions, ONG, de bureaux sur des chantiers de gros œuvres (pont, barrage hydroélectrique, centrale thermique, gratte-ciel).<br> Ces édifices sont pour la grande majorité personnalisée selon le nombre de bureaux, pièces souhaités par le demandeur ou pour le projet. Ils peuvent être réalisés à un, deux ou trois niveaux.`
            },
            {
                title: "Bâtiments sanitaires",
                imgs: ["../service/img2.jpg", "../service/img2-2.jpg"], 
                desc: `Facile à installer, à entretenir et simple d’usages. Ces équipements sont faciles à poser. Nos bâtiments d’hygiène font référence aux bungalows toilettes et/ou douches, et aux cabines toilettes.<br> Les éléments sanitaires (lavabo, WC, baignoire, cabine douche…) sont de qualités supérieures. Après installation, le raccordement à la fosse septique et au réseau hydraulique sont les dernières étapes. Les murs sont faits en panneaux sandwich d’épaisseur 40 mm minimum.`
            },
            {
                title: "Bâtiments d'enseignement",
                imgs: ["../service/img4.jpg"],
                desc: `La surface minimale d’une salle standard est de 50 m² à raison de 1,20m²/élèves. Ces salles sont munies de deux portes avec ouverture vers l’extérieur et de fenêtres favorisant de bonnes conditions d’hygiène, aération et d’éclairage. Bat & Prefab vous aide à augmenter rapidement le nombre de vos salles de classe avant ou pendant la rentrée scolaire.`
            },
            {
                title: "Dortoirs",
                imgs: ["../service/img5.jpg"],
                desc: `Ce sont vos maison dans les chantiers, les écoles, les camps… conçus avec tout le confort et la fonctionnalité nécessaire. Nous proposons une gamme variée allant des internats aux dortoirs dans les camps militaires. Nos bâtiments conçus sous forme d’hébergement en commun ou chambre d’hôtel rendent service sous toutes les conditions climatiques.`
            },
            {
                title: "Installations d'Urgence",
                imgs: ["../service/img6.jpg"],
                desc: `Tels les bâtiments médicaux installés d'urgence (COVID-19), nous proposons des salles d’hospitalisation, de dépistage, des laboratoires et des bureaux. Ces préfabriqués peu coûteux permettent de faire face en un temps record aux déficits d’infrastructures et d’améliorer votre plateau technique.`
            },
            {
                title: "Bâtiments réfectoires",
                imgs: ["../service/img7.jpg"],
                desc: `Ce sont soit des constructions préfabriquées sur plateforme soit des bâtiments modulaires (bungalows) standards ou personnalisés pouvant offrir les meilleures commodités.<br>
                 Nos bâtiments réfectoires sont des salles où les membres d'une même communauté, les travailleurs d’une même entreprise, les pensionnaires d’un orphelinat, d’une maison de retraite prennent leur repas ensemble. Le terme est également utilisé pour les lieux de restauration des collectivités, des établissements d'éducation et d'enseignement où il est synonyme de cantine.<br>
                Avec une excellente aération, ils permettent à ses occupants de récréer, de petit-déjeuner, déjeuner et diner dans de meilleures conditions, ce qui constitue déjà un préalable essentiel pour la digestion. Des travailleurs ou apprenants en forme sont plus productifs et réactifs. Et une alimentation saine, un réfectoire bien construit et bien équipé et une ambiance agréable durant le repas contribuent à la santé. Ces réfectoires peuvent être équipés de lave-main, de moustiquaires pour les fenêtres…`
            },
            {
                title: "Centres de loisirs",
                imgs: ["../service/img8.jpg"],
                desc: `Les centres de loisirs sont des lieux aérés, des accueils collectifs pour enfants et jeunes, des espaces de vie au sein duquel les équipes d’animateurs mettent en place des projets d’animation collective pour les enfants et les jeunes en privilégiant la vie de groupe et la participation. Ces centres sont le plus souvent munis d’espaces de recréation, des espaces verts, des bâtiments etc. Nous intervenons en vous aidant dans le choix et la réalisation du modèle précis de bâtiments modulaires qui serait adaptés à votre centre de loisirs et qui conviendrait le mieux à votre public. Avec nous, vous avez un large éventail de choix ce qui vous donne de multiples options de configuration de votre espace. Vous aurez la capacité, avec Bat & Prefab, de rendre dynamique et plus attractif l’aspect de votre environnement public.`
            },
            {
                title: "Maisons",
                imgs: ["../service/img9.jpg", "../service/img9-9.jpg"],
                desc: `Maison préfabriquée ou encore « maison usinée ». Et pour  cause, chaque élément de la construction sera créé et monter en usine avant d’être commercialisé. Ce qui vous permet entre autres d’économiser du temps dans son montage.<br> Les logements préfabriqués fabriqués selon les divers buts d’utilisation et styles de vie permettent aux gens d’acheter leur maison plus facilement en offrant des alternatifs de prix économiques. Ces structures préfabriquées qui sont fabriquées selon les demandes de l’utilisateur et qui incluent tout le confort exigé peuvent être facilement adaptées aux divers lieux d’habitat. Suivant votre besoin, Bat & Prefab a un catalogue de maisons préfabriquées dans lequel vous trouverez assurément la maison de vos rêves. à défaut, transmettez-nous les détails de ce à quoi vous pensez et nous le rendrons réel. 
                Nous avons des maisons basses de deux (2) pièces dont la plus petite dimension est de 40 m², de trois (3) pièces de 59 m² et plus, de quatre (4) pièces de 95 m² et plus, de cinq (5) pièces de 129 m² et plus. Les duplex que nous mettons sur le marché méritent votre attention car ce sont des splendeurs architecturales. Nos maisons modulaires sont également fabriquées à partir de dimensions personnalisées c’est-à-dire que nous vous ferons des propositions en fonction des dimensions que vous mettrez à notre disposition.`
            },
            {
                title: "Cabines Toilettes (W-C et douches)",
                imgs: ["../service/img11.jpg"],
                desc: `A côté des cabines toilettes personnalisées dont nos techniciens ont un savoir-faire assez particulier et exceptionnel, Bat & Prefab fabrique des cabines toilettes (w-c et douches) de dimensions standards :<br><br>
                        -    L 1.35 m × l 1.35m × h 2.35m<br>
                        -    L 1.50m × l 1.50m × h 2.35m<br>
                        -    L 2.10m × l 2.10m × h 2.35m<br>
                        -    L 2.60m × l 1.35m × h 2.35m<br>
                        -    L 2.60m × l 2.60m × h 2.35m<br>
                        -    L 2.00m × l 1.50m × h 2.35m<br>
                        -    L 3.00m × l 2.00m × h 2.35m<br>
                        <br>Réalisées en une seule ou plusieurs pièce(s), les cabines toilettes peuvent être placées côte à côte pour de multiples usages. Nous vous les proposons soit munies d’un réservoir d’eau propre et d’une fosse septique synthétique soit connectées à une fosse septique domestique et alimentées à partir du réseau d’eau ou sans ces éléments cités plus haut c’est-à-dire uniquement le box ou le bungalow.`
            },
            {
                title: "Cabines Guerites",
                imgs: ["../service/img12.jpg"],
                desc: `Les cabines guerites sont utilisées par les administrations, les sites industriels sensibles, pour assurer l’accueil des visiteurs et régler les démarches administratives à l’entrée. D’autres peuvent servir de billetteries, voire de petits points de vente pour des activités ne nécessitant pas de stocker de gros volumes. Elles sont généralement vitrées (nombreuses fenêtres, voire portes vitrées ou non vitrées) de façon à offrir à son occupant une vision le plus large possible.
                Bat & Prefab propose des dimensions standards qui sont les suivantes :<br><br> 
                -   L 1.35 m × l 1.35m × h 2.35m<br>
                -   L 1.50m × l 1.50m × h 2.35m<br>
                -   L 2.10m × l 2.10m × h 2.35m<br>
                -   L 2.60m × l 1.35m × h 2.35m<br>
                -   L 2.60m × l 2.60m × h 2.35m<br>
                -   L 2.00m × l 1.50m × h 2.35m<br>
                -   L 3.00m × l 2.00m × h 2.35m<br>
                <br>Nous avons également des dimensions personnalisées suivant votre projet et vos besoins.`
            },
            {
                title: "Cabines kiosques",
                imgs: ["../service/kab.jpg"],
                desc: `Les cabines kiosques peuvent être installées dans des lieux très fréquentés de manière rapide et simple.<br>
                Il est possible de les installer dans des endroits où le public se rend durant des périodes précises, à des endroits touristiques, à des lieux où le public se rend pour se recréer et à des lieux de fêtes.<br>
                Utilisées fréquemment pour de petits commerces, elles disposent d’espace suffisant pour la réalisation de vos différentes activités d’échanges et vous offrent à la fois un excellent angle de vue sur votre clientèle. Ces cabines occupent très peu d’espace ce qui rend facile leur installation et leur confère une certaine mobilité. Vous avez le choix entre des cabines kiosques standards ou personnalisés.`
            },
            {
                title: "Conteneur Kits",
                imgs: ["../service/img13.jpg"],
                desc: `Les conteneurs kits sont parfaits pour remédier rapidement à vos déficits de bureau. C’est un moyen idéal qui vous permet d’équiper vos chantiers en bureau et/ou étendre vos locaux. appelés bungalows, les conteneurs kits les plus répandus sont ceux de 20 pieds (6m × 2.6m), il y en a de 40 pieds c’est-à-dire (7m × 3m × 2.4m). les types standards sont équipés d’une (1) porte (2m × 0.85m) et de deux (2) fenêtres de dimensions 1m².<br> Ils sont également dotés de luminaires intérieurs (encastrés ou apparents selon la convenance du client) et extérieurs.
                <br>Cependant nous avons des solutions pour des personnes désireuses de bungalows personnalisés. En effet, notre atelier de sur mesure se charge de la fabrication et du montage de tous produits personnalisés en intégrant tous les détails qu’il recevra du client donnant ainsi au bungalow une touche unique.
                <br>Par ailleurs, nos bungalows se montent et se démontent à volonté en quelques heures. Les conteneurs kits ou bungalows ou encore conteneurs préfabriqués sont également très mobiles. Ils se manipulent sans difficulté à la grue ou au chariot élévateur.`
            },
            {
                title: "Conteneur Maritime",
                imgs: ["../service/img14.jpg"],
                desc: `Les conteneurs Maritimes sont des caissons métalliques dont les six faces sont des parallélogrammes conçus pour le transport de marchandises par différents modes de transport. Le prix d’un container occasion est fonction de sa vétusté. Les séries de containers que Bat & Prefab vous propose sont les suivantes :<br><br>
                -   Conteneur 20 pieds<br>
                -   Conteneur 40 pieds<br>
                -   Conteneur à toit ouvert<br>
                -   Conteneur de marchandises dangereuses<br>
                -   Conteneur 10 pieds<br>
                -   Conteneur 30 pieds<br>
                -   Etc.<br>
                <br>Ces conteneurs ont de multiples caractéristiques :
                Résistants, ils permettent un usage répété.
                Permanents, ils sont conçus pour durer de nombreuses années.
                Standardisés, ses dimensions normalisées au niveau international facilitent le transport des marchandises.
                Aménagés, ils peuvent être utilisés pour divers usages (bureaux, chambres, maisons, hôtels, Chambres froides…).
                Le pied est l’unité de longueur que nous utilisons pour les conteneurs maritimes, correspondant à la longueur d’un pied humain c’est-à-dire un peu plus de trente centimètres.`
            },
            {
                title: "L'isolation des Bâtiments",
                imgs: ["../service/img15.jpg", "../service/img16.jpg"],
                desc: `L’isolation est de plusieurs types : Nous avons des isolations thermiques, Isolation contre les insectes ainsi que l'insonorisation ou isolation acoustique. C'est un bon moyen pour lutter contre les nuisances sonores. ... L'isolation acoustique d'un mur est essentielle pour limiter la propagation des sons.
                L'isolation thermique est l'ensemble des techniques mises en œuvre pour limiter les transferts de chaleur entre un milieu chaud et un milieu froid. 
                Quant à L'insonorisation C'est un bon moyen pour lutter contre les nuisances sonores.`
            },
            {
                title: "Aménagement de bâtiments",
                imgs: ["../service/bat.jpg"],
                desc: `L’aménagement intérieur représente l’ensemble des techniques pour aménager l’intérieur d’un immeuble, d’un bâtiment, d’une maison individuelle ou d’un appartement.
                L’aménagement intérieur est de cloisonner des espaces intérieurs pouvant se réaliser par nos techniciens dont le métier consiste à concevoir des espaces bâtis de vie confortables, jolis et fonctionnels dans le respect des exigences du propriétaire.`
            }
        ]
    },
    "batiment": {
        title: "Bâtiments",
        banner: "/service/equipement-et-materiel-chantier-c-banner-original-1405020756.jpg",
        desc: "Travaux de gros œuvre, fondations et structures en béton armé.",
        subCategories: [
            {
                title: "Fondations et Excavation",
                imgs: ["https://images.unsplash.com/photo-1590644365607-1c5a519a7a37"],
                desc: "Une fois l'excavation terminée, nous déposons une couche de béton de propreté de 5 cm d'épaisseur minimale. Le dosage du mortier et le ferraillage sont strictement contrôlés pour garantir la stabilité."
            },
            {
                title: "Murs et Chaînages",
                imgs: ["https://images.unsplash.com/photo-1589939705384-5185137a7f0f"],
                desc: "Utilisation de barres d’armature en forme de L ou de U pour joindre les chaînages horizontaux. Arrosage systématique des éléments de maçonnerie avant la pose pour une adhérence maximale du mortier."
            }
        ]
    },
    "soudure": {
        title: "SOUDURE",
        banner: "/banniere/Les_techniques_de_soudure_utilis_es_dans_la_construction_d_une_charpente_m_tallique.jpg",
        desc: "Conception de charpentes métalliques et tuyauterie industrielle.",
        subCategories: [
            {
                title: "Portes métalliques",
                imgs: ["../service/pot.jpg"],
                desc: `Une porte métallique est une porte avec des caractéristiques et des performances supérieures aux portes dites standards. En effet, les portes dites standards sont faites à partir de bois et d’aluminium. Les portes métalliques sont d’une solidité incontestable. Elles sont le plus souvent utilisées pour assurer un maximum de sécurité à ceux qui décident de porter leur choix là-dessus.
C’est également une excellente option pour ces personnes qui habitent des régions où on assiste à une présence accrue des termites dévoreuses de bois ou à d’autres qui ont très peu de ressources pour s’offrir des portes en alu, qui coûtent extrêmement chers dans certains lieux.
`
            },
            {
                title: "Portes blindées",
                imgs: ["../service/sed1.jpg"],
                desc: `Une porte blindée est une ouverture constituée très différemment d’une porte standard et d’une porte métallique, ce qui lui permet d’offrir une sécurité très supérieure et pas uniquement par le biais de sa serrure. Elle se compose de plusieurs éléments, assemblés autour d’un panneau en acier. Ces portes sont utilisées pour sécuriser les caisses dans les banques, les pièces qui abritent les coffres forts…`
            },
            {
                title: "Charpentes métalliques",
                imgs: ["../service/sed2.jpg"],
                desc: `Une charpente métallique est une structure généralement en acier. Composé d’éléments usinés en atelier et assemblés sur le chantier, elle constitue une alternative économique et pratique à la charpente traditionnelle.
Avec l’expérience et le savoir-faire, ces charpentes sont assemblées rapidement et nécessitent très peu de bras valides. Elles sont couvertes de tôles suivant le niveau de luminosité que vous souhaitez obtenir. Elles permettent un entreposage optimal lorsqu’ elles doivent servir d’entrepôt.
`
            },
            {
                title: "Antivol fenêtres et portes",
                imgs: ["../service/sed3.jpg"],
                desc: `Un antivol peut être distinct de l’objet qu’il est destiné à protéger, ou bien être intégré à cet objet. Il est conçu de sorte que son retrait ou sa désactivation ne puisse être effectué que par le propriétaire de l’objet.`
            },
            {
                title: "Escalier",
                imgs: ["../service/sed4.jpg"],
                desc: `Un escalier est une construction architecturale constituée d’une suite régulière de marches, ou degrés, permettant d’accéder à un étage, de passer d’un niveau a un autre en montant et descendant.`
            },
            {
                title: "Mezzanine ",
                imgs: ["../service/sed6.jpg"],
                desc: `Une mezzanine est un étage intermédiaire entre deux grands ou un espace généralement bordé d’un garde-corps et en surplomb sur la pièce principale.
La mezzanine est aussi une construction réalisée à partir de poteaux, poutres, et solives métalliques et d’un plancher.
`
            }
        ]
    },
    "electricité": {
        title: "Electricité",
        banner: "https://www.guide-artisan.fr/img/actualites/tout-savoir-sur-les-electriciens-en-batiment-1.jpg",
        desc: "Tout ce qu'il faut pour votre batiment",
        subCategories: [
            {
                title: "La conception des réseaux électriques",
                imgs: ["../service/sou1.jpg"],
                desc: `La conception des réseaux électriques a pour objectif de déterminer l’installation électriques satisfaisant les exigences du processus industriel au moindre cout d’investissement, d’exploitation et de défaillance.`
            },
            {
                title: "L’installation des équipements électriques",
                imgs: ["../service/sou2.jpg"],
                desc: ``
            },
            {
                title: "L’entretien et le dépannage des réseaux et équipements électriques",
                imgs: ["../service/sou3.jpg"],
                desc: ``
            },
        ]
    },
    "plomberie": {
        title: "Plomberie",
        banner: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a",
        desc: "Installation de réseaux hydrauliques et équipements sanitaires de haute qualité.",
        subCategories: [
            {
                title: "Installation des équipements sanitaires",
                imgs: ["../service/p1.jpg"],
                desc: `L’installation sanitaire requiert le savoir-faire du plombier (installateur sanitaire) tant dans le cadre d’une rénovation que pour une installation neuve.`
            },
            {
                title: "Réparation des équipements sanitaire",
                imgs: ["../service/p2.jpg"],
                desc: `Les dépannages en plomberie sont divers et variés. Que ce soit au niveau des tuyaux qu’au niveau des systèmes de robinetterie, nos spécialistes font une prise en charge et résolvent la panne en un temps record.
                <br>Les robinets sont un élément clé de votre maison, car ils distribuent l’eau. Il est très important de garder vos robinets en état de marche.`
            },
            {
                title: "Installation et entretien des canalisations d’eaux et d’eaux d’évacuation",
                imgs: ["../service/p3.jpg"],
                desc: `Nos plombiers sont dans un premier lieu des experts en pose sanitaire. Ils peuvent s’occuper de la conception de la salle d’eau, et de la mise en place de la création des canalisations d’eau dans un bâtiment neuf ou ancien pour en faire en sorte à ce que ce type de système d’arrivée et de sortie d’eau soit le plus discret possible.`
            }
        ]
    },
    "plans": {
        title: "Plans 3D & 2D",
        banner: "../service/planban.jpg",
        desc: "Conception architecturale et modélisation.",
        subCategories: [
            {
                title: "Plan de masse",
                imgs: ["../service/pl1.jpg"],
                desc: `Un plan de masse ou dessin d’architecture est un dessin de tout type et nature, utilisé dans le domaine de l’architecture.<br> C’est une représentation technique du bâtiment qui associée à d’autres, permet une compréhension de ses caractéristiques, qu’il soit une construction édifiée ou seulement un projet. Ainsi divers plans forment le cœur d’un dossier de demande de permis de construire.`
            },
            {
                title: "Les Plans 2D",
                imgs: ["../service/pl2.jpg"],
                desc: `Le 2D, deux dimensions ou bidimensionnel sont des expressions qui caractérisent un espace conçu en terme de largeur et de hauteur.<br> Il ne comporte pas de profondeur, au contraire d’un espace en trois dimensions. Les plans 2D donnent une vue d’ensemble du projet`
            },
            {
                title: "Plan 3D",
                imgs: ["../service/pl3.jpg"],
                desc: `Représentation en trois dimensions permettant une immersion totale dans votre futur projet.`
            }
        ]
    },
    "carrelage": {
        title: "Carrelage",
        banner: "../service/carrelage-banniere.jpg",
        desc: `Pose de tous types de carreaux (grès cérame, faïence, pierre naturelle) au sol ou aux murs.`,
        subCategories: [
            {
                title: "Préparation des surfaces à carreler",
                imgs: ["../service/c1.jpg"],
                desc: `La préparation des surfaces est avant tout incontournable pour une pose de carrelage réussie. Pour carreler une surface, celle-ci doit être solide, sèche, parfaitement plane et propre… ce qui nécessite parfois quelques petits travaux !`},
            {
                title: "Découpe des matériaux de revêtement et de finition",
                imgs: ["../service/c2.jpg"],
                desc: `Avant, pour cette étape de découpe, n'existait que la pince à céramique et la pointe à tracer, leur utilisation ne pouvait s'improviser et seuls les gens du métier pouvaient prétendre les maîtriser. Il fallait tracer, rayer, casser, grignoter et limer, tout cela avec patience...
Ces outils restent encore d'actualité pour certains professionnels mais peu d'amateurs ne s'en approchent, leur préférant le coupe carrelage (manuel ou électrique) ou carrelette.
Le coupe carrelage permet avec sécurité et simplicité, après un petit apprentissage, de couper des carreaux pour les ajuster aux dimensions de votre surface à carreler.
Le choix du coupe carrelage est fonction de :
la nature du carreau à découper : surtout son épaisseur ;
la nature des découpes : rectilignes, diagonales ou autres ;
puis la surface à carreler : le nombre de découpes que vous allez devoir répéter
`
             },
            {
                title: "Pose des matériaux de revêtement et réalisation des jointures ",
                imgs: ["../service/c3.jpg"],
                desc: `La pose de matériaux de revêtement 
Les joints vides doivent être secs et propres sur toute la longueur et profondeur.
Nettoyer la surface de toute trace de poussière d’agent de démoulage, etc… et assainir les parties désagrégées avant de faire les joints, veiller à ce que l’adhésif de pose ait bien pris et qu’une bonne partie de son humidité ait été éliminé.
Après la préparation du mélange homogène des deux composants, il s’agit de remplir les joints à l’aide de spatule ou d’une taloche en caoutchouc. Ensuite le matériau superflu est éliminé avec de l’eau, avec un tampon ou une éponge dure, et toujours dans l’intervalle de temps d’utilisation
`
            }
        ]
    },
    "peinture": {
        title: "Peinture",
        banner: "../service/pein0.jpg",
        desc: "Conception architecturale et modélisation.",
        subCategories: [
            {
                title: "Pose des revêtements muraux",
                imgs: ["../service/pein1.jpg"],
                desc: `Application de peintures intérieures et extérieures adaptées à vos besoins. Qu'il s'agisse de finitions mates, satinées ou veloutées, j'assure une application uniforme pour protéger et valoriser vos espaces.` },
            {
                title: "Réalisation des finitions et embellissements des surfaces",
                imgs: ["../service/pein2.jpg"],
                desc: `Mise en œuvre de solutions décoratives variées : papiers peints, toiles de verre, revêtements vinyles ou panoramiques. Je réalise une pose sans raccords visibles pour transformer l'atmosphère de vos pièces.` },
            {
                title: "Préparation du support à enduire",
                imgs: ["../service/pein3.jpg"],
                desc: `Assainissement et mise à nu des murs avant travaux. Nous procédons au rebouchage des fissures, au ponçage et à l’application d’enduits de lissage pour garantir une surface parfaitement plane et une adhérence optimale des futurs revêtements.`
            }
        ]
    },
    "climatisation": {
        title: "Climatisation",
        banner: "/banniere/clam.jpg",
        desc: "Travaux de gros œuvre, fondations et structures en béton armé.",
        subCategories: [
            {
                title: "Installation de chauffage, ventilation et climatisation",
                imgs: ["../service/cli1.jpg"],
                desc: `Les installateurs de climatisation de Bat & Prefab vous accompagnent dans le choix des solutions de chauffage, ventilation et climatisation. Après une visite de votre site, de vos installations et une étude permettant de bien dimensionner les futurs systèmes, nos climaticiens se charge des travaux d’installation et de la mise en marche des équipements. 
                Après cette étape, ils se chargent du contrôle et de la vérification des conditions de confort, les débits d’air, les niveaux d’humidité et de chaleur soient conformes à vos besoins ainsi qu’à la règlementation en vigueur.` 
            },
            {
                title: "Entretien et maintenance",
                imgs: ["../service/cli2.jpg"],
                desc: `Assurez la longévité et la performance de vos installations. Nous intervenons pour le nettoyage des filtres, la désinfection des unités et le contrôle général du système afin de garantir une qualité d'air optimale et de prévenir les pannes, tout en optimisant votre consommation énergétique.`
             }
        ]
    },
    "vitrerie": {
        title: "Vitrerie",
        banner: "../service/vil.jpg",
        desc: "Nous intervenons pour la pose, le remplacement et la modernisation de tous vos vitrages.",
        subCategories: [
            
        ]
        
    },
    "grands ouvrages": {
        title: "Grands ouvrages",
        banner: "../service/ouvrage-2.jpeg",
        desc: "Notre expertise nous permet de piloter et de réaliser des chantiers de grande envergure.",
        subCategories: [
            
        ]
    },
    "chauffage": {
        title: "Installation de chauffage",
        banner: "../service/cha.jpg",
        desc: "Nous concevons et installons des systèmes de chauffage performants et adaptés à votre bâtiment (pompes à chaleur, chaudières, radiateurs).",
        subCategories: [
            
        ]
    }
    
    

};



window.initHorizontalAccordion = function() {
    const container = document.getElementById('accordion-container');
    const oldDynamicContainer = document.getElementById('services-dynamic-container');
    if(oldDynamicContainer) oldDynamicContainer.style.display = 'none';

    if (!container || typeof servicesData === 'undefined') return;

    const keys = Object.keys(servicesData);
    
    let html = '<div class="horizontal-categories-scroll">';
    
    html += keys.map((key) => {
        const cat = servicesData[key];
        return `
            <div class="h-category-card" id="card-${key}" onclick="window.selectCategory('${key}', this)">
                <div class="h-cat-bg" style="background-image: url('${cat.banner}')"></div>
                <div class="h-cat-overlay"></div>
                <div class="h-cat-content">
                    <div class="h-cat-text">
                        <h3>${cat.title.toUpperCase()}</h3>
                        <p>${cat.desc}</p>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    html += '</div>';

    html += '<div class="details-master-container" style="width: 100%; margin-top: 30px;">';
    html += keys.map((key) => {
        return `<div id="details-${key}" class="service-details-inline" style="height: 0; overflow: hidden; background: transparent;"></div>`;
    }).join('');
    html += '</div>';

    container.innerHTML = html;
};

window.selectCategory = function(key, element) {
    const targetDetails = document.getElementById(`details-${key}`);
    const isAlreadyOpen = element.classList.contains('active');

    document.querySelectorAll('.h-category-card').forEach(item => {
        if(item !== element) {
            item.classList.remove('active');
            const otherKey = item.id.replace('card-', '');
            const otherDetails = document.getElementById(`details-${otherKey}`);
            if(otherDetails) {
                gsap.to(otherDetails, { height: 0, duration: 0.4, ease: "power2.inOut" });
                otherDetails.style.overflow = "hidden";
            }
        }
    });

    if (!isAlreadyOpen) {
   
        element.classList.add('active');
        
        if (targetDetails.innerHTML.trim() === "") {
            const data = servicesData[key];
            if (data && data.subCategories) {
                targetDetails.innerHTML = `<div class="inner-grid-container">${window.generateSubCategoriesHTML(data.subCategories)}</div>`;
            }
        }
        
        gsap.to(targetDetails, { 
            height: "auto", 
            duration: 0.5, 
            ease: "power2.out",
            onComplete: () => {
                targetDetails.style.height = "auto";
                targetDetails.style.minHeight = "min-content"; 
                targetDetails.style.overflow = "visible";
                window.dispatchEvent(new Event('resize'));
                if(window.ScrollTrigger) ScrollTrigger.refresh();
            }
        });

        setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }, 300);

    } else {
        element.classList.remove('active');
        targetDetails.style.overflow = "hidden";
        gsap.to(targetDetails, { height: 0, duration: 0.4, ease: "power2.inOut" });
    }
};

window.generateSubCategoriesHTML = function(subs) {
    if (!subs || subs.length === 0) return '<p style="padding:20px; color:#aaa; text-align:center;">Aucun détail disponible pour le moment.</p>';

    return subs.map(s => {
        const safeTitle = s.title.replace(/'/g, "&#39;").replace(/"/g, "&quot;");
        const safeDesc = s.desc.replace(/'/g, "&#39;").replace(/"/g, "&quot;").replace(/\r?\n/g, "<br>");
        const imgsJson = JSON.stringify(s.imgs || []).replace(/'/g, "&#39;"); 

        const imgUrl = (s.imgs && s.imgs.length > 0) ? s.imgs[0] : 'https://via.placeholder.com/300x200?text=Pas+d+image';

        return `
        <div class="service-card inline-card">
            <div class="pillar-img-container">
                <img src="${imgUrl}" alt="${s.title}">
            </div>
            <h3>${s.title}</h3>
            <p class="card-preview-desc">${s.desc}</p>
            <button class="btn-pillar-more" onclick='window.openServiceLightbox("${safeTitle}", "${safeDesc}", ${imgsJson})'>
                EN SAVOIR PLUS
            </button>
        </div>
    `;
    }).join('');
};






window.openServiceLightbox = function(title, description, images, index = 0) {
    const lightbox = document.getElementById('service-lightbox');
    const content = document.querySelector('.svc-lb-content');
    const imgElement = document.getElementById('svc-lb-img');
    const textDiv = document.getElementById('svc-lb-text-custom');

    if (!lightbox || !content) return;

    window.currentImages = images || [];
    window.currentIndex = index;
    imgElement.src = window.currentImages[index] || '';
    
    textDiv.innerHTML = `
        <h2 style="color:var(--accent-color); font-family:'Oswald'; font-size:2.2rem; margin-bottom:20px;">${title}</h2>
        <div style="color:#eee; line-height:1.8; font-size:1rem;">${description}</div>
    `;
    
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    gsap.fromTo(content, 
        { scale: 0.7, opacity: 0, y: 50 }, 
        { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.7)" }
    );
};
window.closeServiceLightbox = function() {
    const lightbox = document.getElementById('service-lightbox');
    const content = document.querySelector('.svc-lb-content');

    gsap.to(content, { scale: 0.8, opacity: 0, duration: 0.3 });
    gsap.to(lightbox, { opacity: 0, duration: 0.3, onComplete: () => {
        lightbox.style.display = 'none';
        lightbox.style.opacity = '1'; 
        document.body.style.overflow = 'auto';
    }});
};

window.changeServiceImg = function(dir) {
    if (!window.currentImages || window.currentImages.length === 0) return;
    window.currentIndex = (window.currentIndex + dir + window.currentImages.length) % window.currentImages.length;
    const img = document.getElementById('svc-lb-img');
    if(img) img.src = window.currentImages[window.currentIndex];
};
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById('accordion-container')) {
        window.initHorizontalAccordion();
    }
});

    document.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('keydown', e => {
        if (e.key === "F12" || 
           (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J")) || 
           (e.ctrlKey && (e.key === "u" || e.key === "s"))) {
            e.preventDefault();
        }
    });

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.play();
        } else {
            entry.target.pause();
        }
    });
}, { threshold: 0.1 });


document.querySelectorAll('.parallax-img video').forEach(v => observer.observe(v));

document.addEventListener("DOMContentLoaded", async () => {
    const canvas = document.getElementById("pdf-canvas");
    if (!canvas) return;
  
    const url = "PREFAB+1.pdf";
    const ctx = canvas.getContext("2d");
    const pageInfo = document.getElementById("page-info");
    const nextBtn = document.getElementById("next-page");
    const prevBtn = document.getElementById("prev-page");
  
    if (!pageInfo || !nextBtn || !prevBtn) return;
  
    let pdfDoc = null;
    let pageNum = 1;
  
    try {
        pdfDoc = await pdfjsLib.getDocument(url).promise;
        renderPage(pageNum);
    } catch(e) {
        console.warn("PDF non disponible", e);
        return;
    }
  
    async function renderPage(num){
        const page = await pdfDoc.getPage(num);
        const viewport = page.getViewport({scale:1.5});
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: ctx, viewport: viewport }).promise;
        pageInfo.textContent = "Page " + num + " / " + pdfDoc.numPages;
    }
  
    function flipAnimation(){
        canvas.classList.add("page-flip");
        setTimeout(() => canvas.classList.remove("page-flip"), 600);
    }
  
    nextBtn.onclick = async () => {
        if(pageNum >= pdfDoc.numPages) return;
        flipAnimation();
        pageNum++;
        setTimeout(() => renderPage(pageNum), 300);
    };
  
    prevBtn.onclick = async () => {
        if(pageNum <= 1) return;
        flipAnimation();
        pageNum--;
        setTimeout(() => renderPage(pageNum), 300);
    };
});

document.addEventListener("DOMContentLoaded", () => {
    const words = document.querySelectorAll('.vertical-word');
    
    words.forEach(word => {
        const text = word.textContent.trim();
        word.innerHTML = '';
        [...text].forEach(letter => {
            const span = document.createElement('span');
            span.textContent = letter;
            span.className = 'vertical-letter';
            span.style.display = 'inline-block';
            word.appendChild(span);
        });
    });

    const mainTl = gsap.timeline({ repeat: -1 });

    words.forEach((word) => {
        const letters = word.querySelectorAll('.vertical-letter');
        
        mainTl.set(word, { visibility: 'visible', opacity: 1 })
              .from(letters, {
                  opacity: 0,
                  y: 10,
                  stagger: 0.08,
                  duration: 0.4,
                  ease: "power2.out"
              })
              .to({}, { duration: 2.5 }) 
              .to(word, {
                  opacity: 0,
                  y: -10, 
                  duration: 0.5,
                  ease: "power2.in",
                  onComplete: () => {
                      gsap.set(word, { visibility: 'hidden', opacity: 1, y: 0 });
                  }
              });
    });
});
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header-wrapper');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

async function fetchHomeProjects() {
    const { data, error } = await _supabase
        .from('realisations')
        .select('id, title, description, image_url, video_url, created_at, date_realisation')
        .order('created_at', { ascending: false, nullsLast: true })
        .limit(6);

    if (error || !data || data.length === 0) {
        document.getElementById('projects-container').innerHTML = 
            '<div class="swiper-slide">Aucun projet à afficher pour le moment.</div>';
        return;
    }

    let html = "";
    data.forEach(project => {
        const mainImg = project.image_url || 'https://via.placeholder.com/600x400';
        
        let dateAffiche = "RÉALISATION";
        const dateSource = project.date_realisation || project.created_at;
        if (dateSource) {
            const dateObj = new Date(dateSource);
            if (!isNaN(dateObj.getTime())) {
                const options = { day: 'numeric', month: 'short', year: 'numeric' };
                dateAffiche = dateObj.toLocaleDateString('fr-FR', options).toUpperCase();
            }
        }

        html += `
            <div class="swiper-slide">
                <div class="project-item">
                    <div class="project-media">
                        <img src="${mainImg}" alt="${project.title}">
                        <span class="project-badge">${dateAffiche}</span>
                    </div>
                    <div class="project-content text-left">
                        <h3 class="project-title">${project.title}</h3>
                        <p class="project-description">
                            ${project.description ? project.description.substring(0, 80) + '...' : ''}
                        </p>
                    </div>
                </div>
            </div>`;
    });

    document.getElementById('projects-container').innerHTML = html;

    if (window.projectsSwiper) window.projectsSwiper.update();
}

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById('projects-container')) {
        fetchHomeProjects();
    }

    if (window.matchMedia("(pointer: fine)").matches) {
        const cursor = document.querySelector(".custom-cursor");
        const cursorDot = document.querySelector(".cursor-dot");

        if (cursor && cursorDot) {
            window.addEventListener("mousemove", (e) => {
                gsap.to(cursor, {
                    x: e.clientX,
                    y: e.clientY,
                    duration: 0.5,
                    ease: "power2.out"
                });
                gsap.to(cursorDot, {
                    x: e.clientX,
                    y: e.clientY,
                    duration: 0.1
                });
            });

            const links = document.querySelectorAll("a, button, .project-item, .menu-toggle");
            links.forEach(link => {
                link.addEventListener("mouseenter", () => {
                    cursor.classList.add("cursor-hover");
                });
                link.addEventListener("mouseleave", () => {
                    cursor.classList.remove("cursor-hover");
                });
            });
        }
    }
});

function enableFullProtection() {
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    document.addEventListener('selectstart', (e) => e.preventDefault());
    document.addEventListener('dragstart', (e) => e.preventDefault());

    document.addEventListener('keydown', (e) => {
        const key = e.key;
        const ctrl = e.ctrlKey || e.metaKey;
        const shift = e.shiftKey;

        if (key === 'F12' || 
            (ctrl && shift && (key === 'I' || key === 'J')) ||
            (ctrl && key === 'u') ||
            (ctrl && key === 's')) {
            e.preventDefault();
        }

        if (key === 'PrintScreen') {
            e.preventDefault();
            alert('Propriété de Bat & PREFAB - Capture d\'écran désactivée sur ce site.');
        }
    });

    const allMedia = document.querySelectorAll('img, video');
    allMedia.forEach(media => {
        media.setAttribute('draggable', 'false');
        media.addEventListener('dragstart', (e) => e.preventDefault());
    });

    document.querySelectorAll('img, video').forEach(el => {
        el.addEventListener('contextmenu', (e) => e.preventDefault());
    });

  

    document.addEventListener('copy', (e) => e.preventDefault());
    document.addEventListener('cut', (e) => e.preventDefault());
    document.addEventListener('paste', (e) => e.preventDefault());

    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('contextmenu', (e) => e.preventDefault());
        
    });

    const style = document.createElement('style');
    style.textContent = `
        * {
            user-select: none !important;
            -webkit-tap-highlight-color: transparent;
        }
        input, textarea {
            user-select: text !important;
        }
    `;
    document.head.appendChild(style);

    
}


function addWatermark() {
    const watermark = document.createElement('div');
    watermark.textContent = 'CONFIDENTIEL - CAPTURE INTERDITE';
    watermark.style.position = 'fixed';
    watermark.style.bottom = '10px';
    watermark.style.right = '10px';
    watermark.style.backgroundColor = 'rgba(0,0,0,0.7)';
    watermark.style.color = 'white';
    watermark.style.padding = '5px 10px';
    watermark.style.fontSize = '12px';
    watermark.style.zIndex = '9999';
    watermark.style.pointerEvents = 'none';
    document.body.appendChild(watermark);

   
}

const supabaseGestGlobal = supabase.createClient('https://kqlzvczfxzlkcxziapin.supabase.co', 'sb_publishable_B7b1OPGP0L-KZR7Q-7_Iog_c2X6KbIm');

let globalSavProjet = null;
let globalSavSessionId = localStorage.getItem('sav_session_id');
let globalSavPendingFile = null;

if (!globalSavSessionId) {
    globalSavSessionId = 'sav_' + Date.now() + '_' + Math.random().toString(36).substring(2, 10);
    localStorage.setItem('sav_session_id', globalSavSessionId);
}

window.openGlobalChatWithNumero = async function() {
    const numero = prompt("Entrez votre numéro de commande (ex: PREFAB-2026-XXXXXX) :");
    if (!numero) return;
    
    const { data: projet, error } = await supabaseGestGlobal
        .from('projets')
        .select('id, nom_client, numero_unique')
        .eq('numero_unique', numero)
        .single();
        
    if (error || !projet) {
        alert("Numéro introuvable. Veuillez vérifier.");
        return;
    }
    globalSavProjet = projet;
    showGlobalChatModal();
};

function showGlobalChatModal() {
    let modal = document.getElementById('globalChatSavModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'globalChatSavModal';
        modal.className = 'chat-modal';
        modal.innerHTML = `
            <div class="chat-header" id="global-chat-header">
                <h4><i class="fas fa-headset"></i> Support SAV</h4>
                <button class="close-chat" onclick="closeGlobalChat()">&times;</button>
            </div>
            <div class="chat-messages" id="global-chat-messages"></div>
            <div class="chat-input-area">
                <input type="text" id="global-chat-input" placeholder="Votre message...">
                <input type="file" id="global-chat-file-input" accept="image/*,video/*" style="display:none;">
                <button class="file-btn" onclick="document.getElementById('global-chat-file-input').click()"><i class="fas fa-paperclip"></i></button>
                <button onclick="sendGlobalChatMessage()"><i class="fas fa-paper-plane"></i></button>
            </div>
            <div id="global-media-preview" class="media-preview" style="display:none;"></div>
        `;
        document.body.appendChild(modal);
        
        if (!document.querySelector('#global-chat-styles')) {
            const style = document.createElement('style');
            style.id = 'global-chat-styles';
            style.textContent = `
                .chat-modal { display: none; position: fixed; bottom: 20px; right: 20px; width: 380px; height: 550px; background: white; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.2); z-index: 10001; flex-direction: column; overflow: hidden; border: 1px solid #e0e0e0; }
                .chat-modal.open { display: flex; }
                .chat-header { background: #0066CC; color: white; padding: 15px; display: flex; justify-content: space-between; align-items: center; cursor: move; border-bottom: 2px solid #FFD700; }
                .chat-header h4 { margin: 0; font-family: 'Oswald', sans-serif; font-size: 1rem; }
                .chat-header .close-chat { background: none; border: none; color: white; font-size: 1.2rem; cursor: pointer; }
                .chat-messages { flex: 1; overflow-y: auto; padding: 15px; background: #f8f9fa; display: flex; flex-direction: column; gap: 10px; }
                .message { max-width: 80%; padding: 10px 14px; border-radius: 18px; font-size: 0.85rem; word-wrap: break-word; }
                .message.client { background: #0066CC; color: white; align-self: flex-end; border-bottom-right-radius: 5px; }
                .message.admin { background: #f1f3f5; color: #1a1a1a; align-self: flex-start; border-bottom-left-radius: 5px; border: 1px solid #dee2e6; }
                .message.system { background: #fff3cd; color: #856404; align-self: center; font-size: 0.7rem; max-width: 90%; border: 1px solid #ffeeba; }
                .message img, .message video { max-width: 100%; border-radius: 12px; margin-top: 5px; cursor: pointer; }
                .chat-input-area { padding: 10px; border-top: 1px solid #dee2e6; background: white; display: flex; flex-wrap: wrap; gap: 8px; }
                .chat-input-area input[type="text"] { flex: 1; padding: 10px; border: 1px solid #ced4da; border-radius: 25px; margin: 0; }
                .chat-input-area button { background: #0066CC; color: white; border: none; border-radius: 50%; width: 40px; height: 40px; cursor: pointer; }
                .chat-input-area .file-btn { background: #6c757d; }
                .media-preview { padding: 5px 10px; background: #e9ecef; border-radius: 8px; font-size: 0.7rem; display: flex; align-items: center; gap: 8px; }
                .media-preview button { background: #dc3545; width: 22px; height: 22px; font-size: 0.7rem; border-radius: 50%; }
            `;
            document.head.appendChild(style);
        }
        
        document.getElementById('global-chat-file-input').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            globalSavPendingFile = file;
            const preview = document.getElementById('global-media-preview');
            preview.innerHTML = `<span><i class="fas fa-paperclip"></i> ${file.name.substring(0,30)}</span><button onclick="cancelGlobalFile()"><i class="fas fa-times"></i></button>`;
            preview.style.display = 'flex';
        });
        
        document.getElementById('global-chat-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendGlobalChatMessage();
        });
        const globalMessagesDiv = modal.querySelector('.chat-messages');
        if (globalMessagesDiv) {
            globalMessagesDiv.addEventListener('click', function(e) {
                let img = e.target.closest('img');
                if (img && img.closest('.message')) {
                    e.preventDefault();
                    e.stopPropagation();
                    window.openImageLightbox(img.src);
                    return;
                }
                let video = e.target.closest('video');
                if (video && video.closest('.message')) {
                    e.preventDefault();
                    e.stopPropagation();
                    window.open(video.src, '_blank');
                    return;
                }
            });
        }
        makeDraggableGlobal(modal);
    }
    
    const headerTitle = modal.querySelector('.chat-header h4');
    if (headerTitle && globalSavProjet) {
        headerTitle.innerHTML = `<i class="fas fa-headset"></i> ${escapeHtmlGlobal(globalSavProjet.nom_client)} – Support SAV`;
    }
    
    modal.classList.add('open');
    loadGlobalChatHistory();
}

window.closeGlobalChat = function() {
    const modal = document.getElementById('globalChatSavModal');
    if (modal) modal.classList.remove('open');
};

window.cancelGlobalFile = function() {
    globalSavPendingFile = null;
    const preview = document.getElementById('global-media-preview');
    if (preview) preview.style.display = 'none';
    const fileInput = document.getElementById('global-chat-file-input');
    if (fileInput) fileInput.value = '';
};

async function loadGlobalChatHistory() {
    if (!globalSavProjet) return;
    const { data, error } = await supabaseGestGlobal
        .from('chat_sav')
        .select('*')
        .eq('projet_id', globalSavProjet.id)
        .order('created_at', { ascending: true });
    
    const messagesDiv = document.getElementById('global-chat-messages');
    if (!messagesDiv) return;
    messagesDiv.innerHTML = '';
    
    if (error || !data || data.length === 0) {
        messagesDiv.innerHTML = '<div class="message system">Bienvenue ! Un conseiller vous répondra dans les meilleurs délais.</div>';
        if (!error && (!data || data.length === 0)) {
            await supabaseGestGlobal.from('chat_sav').insert([{
                projet_id: globalSavProjet.id,
                session_id: globalSavSessionId,
                client_name: globalSavProjet.nom_client,
                message: "Bienvenue ! Un conseiller vous répondra dans les meilleurs délais.",
                sender: 'system'
            }]);
            loadGlobalChatHistory();
        }
        return;
    }
    
    data.forEach(msg => {
        if (msg.message && msg.message.startsWith('CLIENT_NAME:')) return;
        addGlobalMessage(msg.message, msg.sender, msg.file_url, msg.file_type);
    });
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function addGlobalMessage(text, sender, fileUrl, fileType) {
    const messagesDiv = document.getElementById('global-chat-messages');
    if (!messagesDiv) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender === 'client' ? 'client' : (sender === 'admin' ? 'admin' : 'system')}`;
    let html = '';
    if (fileUrl && fileType) {
        if (fileType.startsWith('image/')) {
            html += `<img src="${fileUrl}" alt="Image" style="cursor:pointer;" onclick="event.stopPropagation(); window.openImageLightbox('${fileUrl}'); return false;">`;
        } else if (fileType.startsWith('video/')) {
            html += `<video src="${fileUrl}" controls></video>`;
        } else {
            html += `<a href="${fileUrl}" target="_blank">Télécharger le fichier</a>`;
        }
    }
    if (text) html += `<div>${escapeHtmlGlobal(text)}</div>`;
    msgDiv.innerHTML = html;
    messagesDiv.appendChild(msgDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

window.sendGlobalChatMessage = async function() {
    if (!globalSavProjet) {
        alert("Veuillez d'abord entrer un numéro de commande.");
        return;
    }
    const input = document.getElementById('global-chat-input');
    const message = input.value.trim();
    if (!message && !globalSavPendingFile) return;
    
    let fileUrl = null, fileType = null;
    if (globalSavPendingFile) {
        try {
            const ext = globalSavPendingFile.name.split('.').pop();
            const fileName = `chat_sav/${globalSavProjet.id}_${Date.now()}.${ext}`;
            const { error: uploadError } = await supabaseGestGlobal.storage.from('chat_sav').upload(fileName, globalSavPendingFile);
            if (uploadError) throw uploadError;
            const { data: pubData } = supabaseGestGlobal.storage.from('chat_sav').getPublicUrl(fileName);
            fileUrl = pubData.publicUrl;
            fileType = globalSavPendingFile.type;
            globalSavPendingFile = null;
            const preview = document.getElementById('global-media-preview');
            if (preview) preview.style.display = 'none';
            const fileInput = document.getElementById('global-chat-file-input');
            if (fileInput) fileInput.value = '';
        } catch (err) {
            console.error(err);
            addGlobalMessage("Erreur lors de l'envoi du fichier", 'system');
            return;
        }
    }
    
    const { error } = await supabaseGestGlobal.from('chat_sav').insert([{
        projet_id: globalSavProjet.id,
        session_id: globalSavSessionId,
        client_name: globalSavProjet.nom_client,
        message: message || '',
        sender: 'client',
        file_url: fileUrl,
        file_type: fileType
    }]);
    
    if (error) {
        console.error(error);
        addGlobalMessage("Erreur d'envoi", 'system');
    } else {
        input.value = '';
        addGlobalMessage(message, 'client', fileUrl, fileType);
    }
};

supabaseGestGlobal.channel('global-sav-chat')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_sav' }, (payload) => {
        const newMsg = payload.new;
        if (globalSavProjet && newMsg.projet_id === globalSavProjet.id && newMsg.sender === 'admin') {
            addGlobalMessage(newMsg.message, 'admin', newMsg.file_url, newMsg.file_type);
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3');
            audio.play().catch(()=>{});
        }
    })
    .subscribe();

function makeDraggableGlobal(modal) {
    const header = modal.querySelector('.chat-header');
    if (!header) return;
    let isDragging = false, startX, startY, startLeft, startTop;
    header.addEventListener('mousedown', (e) => {
        if (e.target === header || header.contains(e.target)) {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            const rect = modal.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;
            modal.style.position = 'fixed';
            modal.style.left = startLeft + 'px';
            modal.style.top = startTop + 'px';
            modal.style.bottom = 'auto';
            modal.style.right = 'auto';
            e.preventDefault();
        }
    });
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            modal.style.left = (startLeft + e.clientX - startX) + 'px';
            modal.style.top = (startTop + e.clientY - startY) + 'px';
        }
    });
    document.addEventListener('mouseup', () => { isDragging = false; });
}

function escapeHtmlGlobal(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}
document.addEventListener('DOMContentLoaded', enableFullProtection);

window.openImageLightbox = function(imageUrl) {
    let existing = document.getElementById('chat-image-lightbox');
    if (existing) existing.remove();
    const overlay = document.createElement('div');
    overlay.id = 'chat-image-lightbox';
    overlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.95); z-index:20000; display:flex; justify-content:center; align-items:center; cursor:pointer; backdrop-filter:blur(5px);';
    const img = document.createElement('img');
    img.src = imageUrl;
    img.style.cssText = 'max-width:90%; max-height:90%; object-fit:contain; border-radius:12px; box-shadow:0 0 30px rgba(0,0,0,0.5);';

    overlay.appendChild(img);
    document.body.appendChild(overlay);
    overlay.addEventListener('click', () => overlay.remove());
    img.addEventListener('click', (e) => e.stopPropagation());
};
(function() {
    const style = document.createElement('style');
    style.textContent = `
        *:focus-visible {
            outline: 3px solid #0066CC !important;
            outline-offset: 2px !important;
            box-shadow: 0 0 0 4px rgba(0,102,204,0.3) !important;
            transition: outline 0.1s ease;
        }
        /* Pour les boutons du menu burger */
        .menu-toggle:focus-visible,
        .close-invite:focus-visible,
        #chat-trigger:focus-visible,
        .floating-suivi:focus-visible {
            outline: 3px solid #FFC107 !important;
            outline-offset: 2px;
            border-radius: 30px;
        }
    `;
    document.head.appendChild(style);

    const burger = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav-links');
    const overlay = document.getElementById('menu-overlay');

    if (burger && nav) {
        burger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                burger.click(); 
            }
        });
        if (overlay) {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && nav.classList.contains('nav-active')) {
                    overlay.click(); 
                }
            });
        }
        const focusableInMenu = () => {
            if (!nav.classList.contains('nav-active')) return [];
            return Array.from(nav.querySelectorAll('a, button, [tabindex="0"]'));
        };
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && nav.classList.contains('nav-active')) {
                const focusable = focusableInMenu();
                if (focusable.length === 0) return;
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        });
    }
    const scrollContainer = document.querySelector('.horizontal-categories-scroll');
    if (scrollContainer) {
        scrollContainer.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                scrollContainer.scrollBy({ left: -300, behavior: 'smooth' });
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                scrollContainer.scrollBy({ left: 300, behavior: 'smooth' });
            }
        });
        if (!scrollContainer.hasAttribute('tabindex')) {
            scrollContainer.setAttribute('tabindex', '0');
        }
    }
    document.querySelectorAll('.btn-pillar-more, .btn-primary, .btn-submit, #send-estimate').forEach(btn => {
        if (!btn.hasAttribute('role')) btn.setAttribute('role', 'button');
        btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                btn.click();
            }
        });
    });
    const prevBtn = document.querySelector('.swiper-button-prev');
    const nextBtn = document.querySelector('.swiper-button-next');
    if (prevBtn && nextBtn) {
        prevBtn.setAttribute('role', 'button');
        nextBtn.setAttribute('role', 'button');
        prevBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                prevBtn.click();
            }
        });
        nextBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                nextBtn.click();
            }
        });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const lightbox = document.getElementById('project-lightbox');
            if (lightbox && lightbox.style.display === 'flex') {
                const closeBtn = lightbox.querySelector('.close-lightbox');
                if (closeBtn) closeBtn.click();
            }
            const serviceLightbox = document.getElementById('service-lightbox');
            if (serviceLightbox && serviceLightbox.style.display === 'flex') {
                const closeBtn = document.querySelector('.svc-lb-close-btn');
                if (closeBtn) closeBtn.click();
            }
            const promoOverlay = document.getElementById('promo-overlay');
            if (promoOverlay && promoOverlay.style.display === 'flex') {
                const promoClose = promoOverlay.querySelector('.promo-close');
                if (promoClose) promoClose.click();
            }
        }
    });
    document.addEventListener('keydown', (e) => {
        const lightbox = document.getElementById('project-lightbox');
        if (lightbox && lightbox.style.display === 'flex') {
            if (e.key === 'ArrowLeft') {
                const prev = document.getElementById('lb-prev');
                if (prev) prev.click();
            } else if (e.key === 'ArrowRight') {
                const next = document.getElementById('lb-next');
                if (next) next.click();
            }
        }
    });
    const rangeBtns = document.querySelectorAll('.range-btn');
    rangeBtns.forEach(btn => {
        btn.setAttribute('role', 'button');
        btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                btn.click();
            }
        });
    });
    const chatTrigger = document.getElementById('chat-trigger');
    const chatWidget = document.getElementById('chat-widget');
    const closeChat = document.getElementById('close-chat');
    if (chatTrigger && chatWidget) {
        chatTrigger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                chatTrigger.click();
            }
        });
        if (closeChat) {
            closeChat.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    closeChat.click();
                }
            });
        }
        const trapFocus = () => {
            if (!chatWidget.classList.contains('chat-open')) return;
            const focusable = Array.from(chatWidget.querySelectorAll('button, input, textarea, [tabindex="0"]'));
            if (focusable.length === 0) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            const handleTab = (e) => {
                if (e.key !== 'Tab') return;
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            };
            document.addEventListener('keydown', handleTab);
            chatWidget.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    closeChat.click();
                    chatTrigger.focus();
                }
            }, { once: true });
        };
        const observer = new MutationObserver(trapFocus);
        observer.observe(chatWidget, { attributes: true, attributeFilter: ['class'] });
    }
})();