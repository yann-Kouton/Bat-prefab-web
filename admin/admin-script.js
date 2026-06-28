const SESSION_KEY = "batprefab_admin_logged";
const supabaseUrl = 'https://woohnwokwxlakvhtnyxa.supabase.co';
const supabaseKey = 'sb_publishable_GfY7g964Pi2i1PhhQktWqw_1qbY82cX'; 
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);
const EMAILJS_PUBLIC_KEY = "kqxdkTOS4sFpnQUBF"; 
const EMAILJS_SERVICE_ID = "service_8qb456m"; 
const EMAILJS_TEMPLATE_ID = "template_qav6old";
const adminSound = new Audio('https://assets.mixkit.co/active_storage/sfx/1359/1359-preview.mp3');
let currentSelectedSession = null;

const supabaseGestUrl = 'https://kqlzvczfxzlkcxziapin.supabase.co';        
const supabaseGestKey = 'sb_publishable_B7b1OPGP0L-KZR7Q-7_Iog_c2X6KbIm';   
const _supabaseGest = supabase.createClient(supabaseGestUrl, supabaseGestKey);

let currentUser = null; 
let currentFilter = 'all';
let currentProjetIdForEtapes = null;
let currentSavProjetId = null, currentSavClientName = null, currentSavNumero = null, savPendingFile = null;

const MODULES = [
    { id: 'realisations', name: 'Réalisations' },
    { id: 'promotions', name: 'Promotions' },
    { id: 'devis', name: 'Demandes de devis' },
    { id: 'newsletter', name: 'Newsletter' },
    { id: 'suivi', name: 'Suivi des chantiers' },
    { id: 'support', name: 'Support client' },
    { id: 'chat_sav', name: 'Chat SAV' }
];


function hashPassword(password) {
    return CryptoJS.SHA256(password).toString();
}

async function login() {
    const identifier = document.getElementById('login-identifier').value.trim();
    const password = document.getElementById('login-password').value.trim();
    const errorEl = document.getElementById('auth-error');
    if (!identifier || !password) {
        errorEl.textContent = "Veuillez remplir tous les champs";
        errorEl.style.display = "block";
        return;
    }
    const { data, error } = await _supabase
        .from('admin_users')
        .select('*')
        .or(`email.eq.${identifier},username.eq.${identifier}`)
        .maybeSingle();
    if (error || !data) {
        errorEl.textContent = "Identifiants incorrects";
        errorEl.style.display = "block";
        return;
    }
    const passwordHash = hashPassword(password);
    if (data.password_hash !== passwordHash) {
        errorEl.textContent = "Identifiants incorrects";
        errorEl.style.display = "block";
        return;
    }
    currentUser = {
        id: data.id,
        username: data.username,
        email: data.email,
        role: data.role,
        permissions: data.permissions || {}
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));
    document.getElementById('auth-overlay').style.display = "none";
    document.getElementById('admin-wrapper').style.display = "block";
    document.getElementById('current-user-name').innerText = currentUser.username;
    document.getElementById('current-user-role').innerText = currentUser.role === 'super_admin' ? 'Super Admin' : 'Utilisateur';
    renderDashboard();
    loadInitialData();
}

function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    window.location.reload();
}

function checkSession() {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved) {
        currentUser = JSON.parse(saved);
        document.getElementById('auth-overlay').style.display = "none";
        document.getElementById('admin-wrapper').style.display = "block";
        document.getElementById('current-user-name').innerText = currentUser.username;
        document.getElementById('current-user-role').innerText = currentUser.role === 'super_admin' ? 'Super Admin' : 'Utilisateur';
        renderDashboard();
        loadInitialData();
    } else {
        document.getElementById('auth-overlay').style.display = "flex";
        document.getElementById('admin-wrapper').style.display = "none";
    }
}

function hasPermission(moduleId) {
    if (currentUser.role === 'super_admin') return true;
    return currentUser.permissions && currentUser.permissions[moduleId] === true;
}

function renderDashboard() {
    const grid = document.getElementById('dashboard-grid');
    if (!grid) return;
    grid.innerHTML = '';
    if (hasPermission('realisations')) {
        grid.appendChild(createRealisationCard());
        grid.appendChild(createManageRealisationCard());
    }
    if (hasPermission('promotions')) grid.appendChild(createPromotionCard());
    if (hasPermission('devis')) grid.appendChild(createDevisCard());
    if (hasPermission('newsletter')) grid.appendChild(createNewsletterCard());
    if (hasPermission('suivi')) grid.appendChild(createSuiviCard());
    if (hasPermission('support')) grid.appendChild(createSupportCard());
    if (hasPermission('chat_sav')) grid.appendChild(createChatSavCard());
    
    const userMgmtCard = document.getElementById('users-management-card');
    if (currentUser.role === 'super_admin') {
        if (userMgmtCard) userMgmtCard.style.display = 'block';
        loadUsersList();
    } else {
        if (userMgmtCard) userMgmtCard.style.display = 'none';
    }
}

function createRealisationCard() {
    const card = document.createElement('div'); card.className = 'admin-card';
    card.innerHTML = `
        <div class="card-header"><h2>Nouvelle réalisation</h2></div>
        <div class="card-body">
            <label>TITRE DU PROJET *</label><input type="text" id="real-title" placeholder="Ex: Construction d'un entrepôt logistique">
            <label>DESCRIPTION TECHNIQUE</label><textarea id="real-desc" rows="3"></textarea>
            <label>Photo / Vidéo</label><input type="file" id="real-file" accept="image/*,video/*" multiple>
            <label>DATE DE RÉALISATION</label><input type="date" id="real-date">
            <button onclick="addRealisation()" class="btn-primary">PUBLIER LE PROJET</button>
            <div id="upload-status" class="status-text"></div>
        </div>
    `;
    return card;
}

function createManageRealisationCard() {
    const card = document.createElement('div');
    card.className = 'admin-card realisations-list-card'; 
    card.innerHTML = `
        <div class="card-header"><h2>Modifier / Supprimer</h2></div>
        <div class="card-body">
            <div id="admin-realisations-list"><p class="status-text">Chargement...</p></div>
        </div>
    `;
    return card;
}


function createPromotionCard() {
    const card = document.createElement('div'); card.className = 'admin-card';
    card.innerHTML = `
        <div class="card-header"><h2>Promotion pop-up</h2></div>
        <div class="card-body">
            <label>TITRE DE LA PROMO</label><input type="text" id="promo-title" placeholder="Ex: -20% SUR LES PLANS">
            <label>DESCRIPTION</label><textarea id="promo-message" rows="3"></textarea>
            <label>IMAGE</label><input type="file" id="promo-img" accept="image/*">
            
            <!-- NOUVEAUX CHAMPS DATES -->
            <label>DATE DE DÉBUT</label>
            <input type="datetime-local" id="promo-date-debut">
            <label>DATE DE FIN</label>
            <input type="datetime-local" id="promo-date-fin">
            
            <div style="display:flex; gap:12px;">
                <button onclick="publishPromo()" class="btn-primary">ACTIVER</button>
                <button onclick="disablePromo()" class="btn-secondary">DESACTIVER TOUT</button>
            </div>
            <p id="promo-status" class="status-text"></p>
            <div><h4>Offres actives</h4><div id="active-promos-list"></div></div>
        </div>
    `;
    return card;
}

function createDevisCard() {
    const card = document.createElement('div'); card.className = 'admin-card';
    card.innerHTML = `
        <div class="card-header"><h2>Demandes de devis</h2></div>
        <div style="margin-bottom:15px; display:flex; gap:8px; flex-wrap:wrap;">
            <button onclick="filterMessages('all')" class="btn-secondary">Tous</button>
            <button onclick="filterMessages('en_attente')" class="btn-secondary">En attente</button>
            <button onclick="filterMessages('en_cours')" class="btn-secondary">En cours</button>
            <button onclick="filterMessages('traite')" class="btn-secondary">Traites</button>
        </div>
        <div class="card-body"><div id="messages-container" style="max-height:320px; overflow-y:auto;"><p>Chargement...</p></div></div>
    `;
    return card;
}

function createNewsletterCard() {
    const card = document.createElement('div'); card.className = 'admin-card card-newsletter';
    card.innerHTML = `
        <div class="card-header"><h2>Newsletter & campagnes email</h2></div>
        <div class="card-body">
            <div class="tab-buttons"><button class="tab-btn active" id="tab-list-btn" onclick="showTab('list')">Liste des abonnes</button><button class="tab-btn" id="tab-send-btn" onclick="showTab('send')">Envoyer un email</button></div>
            <div id="view-list"><div style="display:flex; gap:10px;"><input type="email" id="manual-email" placeholder="Ajouter un email"><button onclick="addSubscriberManual()" class="btn-secondary">AJOUTER</button></div><div id="subscribers-list"></div></div>
            <div id="view-send" style="display:none;"><p>Email envoyé à <strong id="count-target">0</strong> abonné(s).</p><label>OBJET</label><input type="text" id="mail-subject"><label>TITRE PRINCIPAL</label><input type="text" id="mail-heading"><label>MESSAGE</label><textarea id="mail-body" rows="6"></textarea><label>LIEN BOUTON</label><input type="text" id="mail-link"><div><button onclick="previewEmail()" class="btn-secondary">PREVISUALISER</button><button onclick="sendCampaign()" class="btn-primary">ENVOYER</button></div><div id="sending-log"></div></div>
        </div>
    `;
    return card;
}

function createSuiviCard() {
    const card = document.createElement('div'); card.className = 'admin-card';
    card.innerHTML = `
        <div class="card-header"><h2>Suivi des livraisons & chantiers</h2></div>
        <div class="card-body">
            <div style="display:flex; gap:12px; margin-bottom:20px; flex-wrap:wrap;">
                <div class="search-wrapper"><svg class="search-icon" width="16" height="16"><use href="#icon-search"/></svg><input type="text" id="search-numero" placeholder="Numero suivi" oninput="loadProjetsList()"></div>
                <div class="search-wrapper"><svg class="search-icon" width="16" height="16"><use href="#icon-search"/></svg><input type="text" id="search-nom" placeholder="Nom client" oninput="loadProjetsList()"></div>
                <button onclick="resetSearch()" class="btn-secondary">Reinitialiser</button>
            </div>
            <div style="text-align:right; margin-bottom:20px;"><button onclick="showNewProjetForm()" class="btn-primary"><svg width="14" height="14"><use href="#icon-plus"/></svg> Nouveau projet</button></div>
            <div id="projets-list-container" style="max-height:400px; overflow-y:auto;"><p>Chargement...</p></div>
        </div>
    `;
    return card;
}

function createSupportCard() {
    const card = document.createElement('div'); card.className = 'admin-card';
    card.innerHTML = `
        <div class="card-header"><h2>Support client</h2></div>
        <div class="card-body">
            <div class="chat-container">
                <div class="chat-sidebar"><div style="padding:12px; font-weight:600;">Conversations</div><div id="sessions-container"></div></div>
                <div class="chat-main"><div id="active-session-id" style="padding:12px; background:#0a0a0a;"><svg width="14" height="14"><use href="#icon-chat"/></svg> Selectionnez un client</div><div id="admin-messages-box" class="messages-area"></div><div class="reply-area"><input type="text" id="admin-reply-input" placeholder="Votre reponse..."><button onclick="sendAdminReply()" class="btn-primary">ENVOYER</button></div></div>
            </div>
        </div>
    `;
    return card;
}

function createChatSavCard() {
    const card = document.createElement('div'); card.className = 'admin-card';
    card.innerHTML = `
        <div class="card-header"><h2>Chat SAV - Suivi commandes</h2></div>
        <div class="card-body">
            <div class="chat-sav-container" style="display:flex; flex-wrap:wrap; background:#111; border-radius:20px;">
                <div class="chat-sav-sidebar" style="width:260px; border-right:1px solid #2c2c2c;"><div style="padding:12px; font-weight:600;">Projets avec messages</div><div id="sav-projets-list"></div></div>
                <div class="chat-sav-main" style="flex:1;"><div id="sav-active-info" style="padding:12px;"><svg width="14" height="14"><use href="#icon-chat"/></svg> Selectionnez un projet</div><div id="sav-messages-box" class="messages-area" style="height:380px;"></div><div class="reply-area" style="display:flex; gap:10px; padding:15px;"><input type="text" id="sav-reply-input" placeholder="Votre reponse..." style="flex:1;"><input type="file" id="sav-reply-file" accept="image/*,video/*" style="display:none;"><button onclick="document.getElementById('sav-reply-file').click()" class="btn-secondary"><svg width="16" height="16"><use href="#icon-upload"/></svg></button><span id="sav-file-name" class="status-text"></span><button onclick="sendSavReply()" class="btn-primary">ENVOYER</button></div></div>
            </div>
        </div>
    `;
    return card;
}

function loadInitialData() {
    if (hasPermission('realisations')) loadAdminRealisations();
    if (hasPermission('devis')) loadMessages();
    if (hasPermission('newsletter')) loadSubscribers();
    if (hasPermission('support')) loadChatSessions();
    if (hasPermission('promotions')) loadActivePromosList();
    if (hasPermission('suivi')) loadProjetsList();
    if (hasPermission('chat_sav')) loadSavProjets();
}

async function loadUsersList() {
    if (currentUser.role !== 'super_admin') return;
    const container = document.getElementById('users-list-container');
    if (!container) return;
    container.innerHTML = '<p>Chargement...</p>';
    const { data, error } = await _supabase.from('admin_users').select('*').order('created_at', { ascending: false });
    if (error) { container.innerHTML = '<p>Erreur chargement</p>'; return; }
    if (!data.length) { container.innerHTML = '<p>Aucun utilisateur</p>'; return; }
    let html = `<table class="users-table"><thead><tr><th>Nom d'utilisateur</th><th>Email</th><th>Rôle</th><th>Permissions</th><th>Actions</th></tr></thead><tbody>`;
    for (let u of data) {
        let perms = u.permissions || {};
        let permList = MODULES.filter(m => perms[m.id]).map(m => m.name).join(', ') || 'Aucune';
        html += `<tr>
            <td>${escapeHtml(u.username)}</td>
            <td>${escapeHtml(u.email || '')}</td>
            <td>${u.role === 'super_admin' ? 'Super Admin' : 'Utilisateur'}</td>
            <td>${permList}</td>
            <td>
                <button onclick="editUserPermissions(${u.id})" class="btn-secondary"><svg width="14" height="14"><use href="#icon-edit"/></svg> Permissions</button>
                <button onclick="deleteUser(${u.id})" class="btn-warning"><svg width="14" height="14"><use href="#icon-trash"/></svg> Supprimer</button>
            </td>
        </tr>`;
    }
    html += `</tbody></table>`;
    container.innerHTML = html;
}

function showCreateUserForm() {
    const username = prompt("Nom d'utilisateur (unique) :");
    if (!username) return;
    const email = prompt("Email (optionnel) :");
    const password = prompt("Mot de passe :");
    if (!password) return;
    createUser(username, email, password);
}

async function createUser(username, email, password) {
    const password_hash = hashPassword(password);
    const permissions = {};
    const { error } = await _supabase.from('admin_users').insert([{
        username, email, password_hash, role: 'user', permissions, created_by: currentUser.id
    }]);
    if (error) alert("Erreur création : " + error.message);
    else { alert("Utilisateur créé avec succès !"); loadUsersList(); }
}

async function editUserPermissions(userId) {
    const { data, error } = await _supabase.from('admin_users').select('permissions').eq('id', userId).single();
    if (error) { alert("Erreur chargement"); return; }
    let perms = data.permissions || {};
    let msg = "Attribuer les permissions (cochez les modules) :\n\n";
    for (let i=0; i<MODULES.length; i++) {
        msg += `[${perms[MODULES[i].id] ? 'x' : ' '}] ${MODULES[i].name}\n`;
    }
    msg += "\nEntrez les numéros des modules à activer (ex: 1,3,5) :\n";
    for (let i=0; i<MODULES.length; i++) {
        msg += `${i+1}. ${MODULES[i].name}\n`;
    }
    let input = prompt(msg);
    if (input === null) return;
    let newPerms = {};
    let selected = input.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n) && n>=1 && n<=MODULES.length);
    for (let idx of selected) {
        newPerms[MODULES[idx-1].id] = true;
    }
    const { error: updateError } = await _supabase.from('admin_users').update({ permissions: newPerms }).eq('id', userId);
    if (updateError) alert("Erreur mise à jour : " + updateError.message);
    else { alert("Permissions mises à jour"); loadUsersList(); }
}

async function deleteUser(userId) {
    if (userId === currentUser.id) { alert("Vous ne pouvez pas vous supprimer vous-même"); return; }
    if (!confirm("Supprimer définitivement cet utilisateur ?")) return;
    const { error } = await _supabase.from('admin_users').delete().eq('id', userId);
    if (error) alert("Erreur suppression : " + error.message);
    else loadUsersList();
}

async function addRealisation() {
    const btn = document.querySelector('button[onclick="addRealisation()"]');
    const title = document.getElementById('real-title').value;
    const desc = document.getElementById('real-desc').value;
    const realDate = document.getElementById('real-date').value;
    const fileInput = document.getElementById('real-file');
    const files = fileInput.files;

    if (!title || files.length === 0) {
        alert("Merci de donner un titre et au moins une image/video !");
        return;
    }

    btn.disabled = true;
    btn.innerText = "CHARGEMENT...";

    let uploadedUrls = [];
    let firstImageUrl = null;
    let firstVideoUrl = null;

    try {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}_${i}.${fileExt}`;
            const filePath = `uploads/${fileName}`;
            const { error: uploadError } = await _supabase.storage.from('realisations').upload(filePath, file);
            if (uploadError) throw uploadError;
            const { data: publicData } = _supabase.storage.from('realisations').getPublicUrl(filePath);
            const url = publicData.publicUrl;
            uploadedUrls.push(url);
            if (!firstVideoUrl && file.type.startsWith('video/')) {
                firstVideoUrl = url;
            } else if (!firstImageUrl && file.type.startsWith('image/')) {
                firstImageUrl = url;
            }
        }

        const { error: dbError } = await _supabase.from('realisations').insert([{
            title: title,
            description: desc,
            show_on_home: false,
            image_url: firstImageUrl,
            video_url: firstVideoUrl,
            gallery_urls: uploadedUrls,
            category: "Constructions",
            date_realisation: realDate || null
        }]);

        if (dbError) throw dbError;

        alert("Realisation publiee !");
        location.reload();
    } catch (err) {
        alert("Erreur : " + err.message);
    } finally {
        btn.disabled = false;
        btn.innerText = "PUBLIER LE PROJET";
    }
}

async function deleteRealisation(id) {
    console.log("deleteRealisation appelé pour l'id", id);
    if (!confirm("Supprimer definitivement ce projet et tous ses fichiers associes ?")) return;

    try {
        const { data: projet, error: fetchError } = await _supabase
            .from('realisations')
            .select('gallery_urls, image_url, video_url')
            .eq('id', id)
            .single();

        if (fetchError) throw fetchError;

        const publicBase = _supabase.storage.from('realisations').getPublicUrl('').data.publicUrl;
        const allUrls = [];

        if (projet.image_url) allUrls.push(projet.image_url);
        if (projet.video_url) allUrls.push(projet.video_url);
        if (projet.gallery_urls && projet.gallery_urls.length) allUrls.push(...projet.gallery_urls);

        const pathsToDelete = allUrls.map(url => url.replace(publicBase, ''));

        if (pathsToDelete.length) {
            const { error: storageError } = await _supabase.storage
                .from('realisations')
                .remove(pathsToDelete);
            if (storageError) console.warn("Erreur suppression fichiers:", storageError);
        }

        const { error: deleteError } = await _supabase
            .from('realisations')
            .delete()
            .eq('id', id);
        if (deleteError) throw deleteError;

        alert("Projet et fichiers supprimes !");
        loadAdminRealisations();
    } catch (err) {
        alert("Erreur : " + err.message);
    }
}

async function loadMessages() {
    const container = document.getElementById('messages-container');
    if (!container) return;

    const { data, error } = await _supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error(error);
        container.innerHTML = "Erreur de chargement.";
        return;
    }

    if (data.length === 0) {
        container.innerHTML = "Aucune demande recue.";
        return;
    }

    container.innerHTML = data.map(msg => `
        <div class="message-item" style="border-left-color: ${getStatusColor(msg.status)};">
            <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
                <div>
                    <strong>${escapeHtml(msg.nom)}</strong> — ${escapeHtml(msg.email)}<br>
                    <strong>Tel :</strong> ${escapeHtml(msg.telephone)}<br>
                    <strong>Categorie :</strong> ${escapeHtml(msg.categorie || 'Non specifiee')}
                </div>
                <div style="text-align: right;">
                    <select data-id="${msg.id}" class="status-select" style="background: #2c2c2c; border: 1px solid #444; padding: 5px 10px; border-radius: 20px;">
                        <option value="en_attente" ${msg.status === 'en_attente' ? 'selected' : ''}>En attente</option>
                        <option value="en_cours" ${msg.status === 'en_cours' ? 'selected' : ''}>En cours</option>
                        <option value="traite" ${msg.status === 'traite' ? 'selected' : ''}>Traite</option>
                    </select>
                    <button onclick="deleteContactMessage('${msg.id}')" style="background:#dc3545; color:white; border:none; border-radius: 20px; padding: 4px 12px; margin-left: 8px;">Supprimer</button>
                </div>
            </div>
            <div style="margin-top: 10px; padding: 10px; background: #111;">${escapeHtml(msg.message)}</div>
            <small>${new Date(msg.created_at).toLocaleString()}</small>
        </div>
    `).join('');

    document.querySelectorAll('.status-select').forEach(select => {
        select.addEventListener('change', (e) => {
            const id = select.getAttribute('data-id');
            const newStatus = select.value;
            updateMessageStatus(id, newStatus);
        });
    });
}

function getStatusColor(status) {
    switch (status) {
        case 'en_attente': return '#ffc107';
        case 'en_cours': return '#17a2b8';
        case 'traite': return '#28a745';
        default: return 'var(--blue)';
    }
}

async function deleteContactMessage(id) {
    if (!confirm("Supprimer definitivement cette demande ?")) return;
    const { error } = await _supabase.from('contacts').delete().eq('id', id);
    if (error) alert("Erreur suppression");
    else loadMessages();
}

async function loadSubscribers() {
    const { data: subscribers, error } = await _supabase.from('newsletter').select('*').order('created_at', { ascending: false });
    if (error) {
        console.error("Erreur abonnes:", error);
        return;
    }
    const countTarget = document.getElementById('count-target');
    if (countTarget) countTarget.innerText = subscribers ? subscribers.length : 0;
    const container = document.getElementById('subscribers-list');
    if (!container) return;
    if (!subscribers || subscribers.length === 0) {
        container.innerHTML = "<p style='padding:20px; color:#666;'>Aucun abonne.</p>";
        return;
    }
    container.innerHTML = subscribers.map(s => `
        <div style="padding:10px; border-bottom:1px solid #333; display:flex; justify-content:space-between; align-items:center;">
            <span>${s.email}</span>
            <span style="font-size:0.7rem; color:#666;">${new Date(s.created_at).toLocaleDateString()}</span>
        </div>
    `).join('');
}

async function addSubscriberManual() {
    const emailInput = document.getElementById('manual-email');
    const email = emailInput.value.trim();
    if (!email) {
        alert("Entrez un email.");
        return;
    }
    try {
        const { error } = await _supabase.from('newsletter').insert([{ email: email }]);
        if (error) throw error;
        alert("Abonne ajoute !");
        emailInput.value = "";
        loadSubscribers(); 
    } catch (err) {
        alert("Erreur : " + err.message);
    }
}

function generateEmailHTML(heading, body, link) {
    const logoUrl = "https://www.bat-prefab.com/logo-bat-prefab.png";

    // Définition des icônes SVG inline (pour les réseaux sociaux et les contacts)
    const svgIcons = {
        phone: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#0066CC" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.574 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
        email: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#0066CC" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
        location: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#0066CC" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
        linkedin: `<svg viewBox="0 0 24 24" fill="#0066CC"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
        facebook: `<svg viewBox="0 0 24 24" fill="#0066CC"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
        whatsapp: `<svg viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>`,
        arrow: `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M7 7h10v10"/></svg>`
    };

    return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BAT & PREFAB – Newsletter</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { margin: 0; padding: 20px 10px; background-color: #f4f4f4; font-family: 'Montserrat', Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 5px 15px rgba(0,0,0,0.05); }
        .header { 
            background: #ffffff; 
            padding: 16px 20px; 
            text-align: center; 
            border: 1.5px solid #0066CC; 
            border-top: 4px solid #FFC107;
            border-radius: 10px 10px 0 0;
            margin: 8px 8px 0 8px;
        }
        .header img { max-height: 45px; width: auto; }
        .content { padding: 24px 25px; }
        .heading { 
            font-family: 'Oswald', sans-serif; 
            font-size: 22px; 
            color: #000; 
            text-transform: uppercase; 
            margin-bottom: 16px; 
            border-left: 4px solid #FFC107; 
            padding-left: 14px; 
            line-height: 1.3; 
        }
        .message { font-size: 14px; line-height: 1.5; color: #444; margin-bottom: 20px; }
        .btn { 
            display: inline-block; 
            background-color: #0066CC; 
            color: #ffffff !important; 
            text-decoration: none; 
            padding: 10px 24px; 
            border-radius: 40px; 
            font-weight: bold; 
            font-family: 'Oswald', sans-serif; 
            text-transform: uppercase; 
            letter-spacing: 1px; 
            font-size: 12px; 
            margin-top: 8px; 
        }
        .btn:hover { background-color: #004499; }
        .contact-bar { 
            background: #f9f9f9; 
            padding: 20px; 
            border-top: 1px solid #eee; 
            display: flex; 
            flex-wrap: wrap; 
            justify-content: space-between; 
            gap: 15px; 
        }
        .contact-col { flex: 1; min-width: 140px; }
        .contact-col h4 { 
            font-family: 'Oswald', sans-serif; 
            font-size: 13px; 
            color: #0066CC; 
            margin-bottom: 8px; 
            letter-spacing: 0.5px; 
        }
        .contact-item { 
            margin-bottom: 6px; 
            font-size: 11px; 
            display: flex; 
            align-items: center; 
            color: #555; 
            line-height: 1.4;
        }
        .contact-item svg { margin-right: 6px; flex-shrink: 0; }
        .contact-item a { color: #333; text-decoration: none; }
        .contact-item a:hover { color: #0066CC; }
        .social-icons { display: flex; gap: 12px; margin-top: 8px; }
        .social-icons a { display: inline-block; width: 28px; height: 28px; }
        .social-icons a svg { width: 100%; height: 100%; }
        .support-buttons { 
            display: flex; 
            flex-wrap: wrap; 
            justify-content: center; 
            gap: 12px; 
            margin: 16px 15px 12px; 
        }
        .support-btn { 
            display: inline-flex; 
            align-items: center; 
            background-color: #0066CC; 
            color: #fff !important; 
            text-decoration: none; 
            padding: 8px 16px; 
            border-radius: 30px; 
            font-weight: bold; 
            font-size: 12px; 
            font-family: 'Montserrat', sans-serif; 
            gap: 6px;
        }
        .support-btn svg { fill: none; stroke: #fff; width: 16px; height: 16px; }
        .support-btn.outline { background-color: transparent; border: 1px solid #0066CC; color: #0066CC !important; }
        .support-btn.outline svg { stroke: #0066CC; }
        .support-btn:hover { background-color: #004499; color: #fff !important; }
        .support-btn.outline:hover { background-color: #0066CC; color: #fff !important; }
        .footer-links { 
            display: flex; 
            flex-wrap: wrap; 
            justify-content: center; 
            gap: 12px; 
            margin: 12px 15px 0; 
            padding-bottom: 10px; 
        }
        .footer-links a { font-size: 10px; color: #0066CC; text-decoration: none; font-weight: 500; }
        .footer-links a:hover { text-decoration: underline; }
        .footer { 
            background: #ffffff; 
            text-align: center; 
            padding: 12px 15px 18px; 
            font-size: 10px; 
            color: #999; 
            border-top: 1px solid #eee; 
        }
        .footer a { color: #0066CC; text-decoration: none; }
        @media (max-width: 550px) {
            .content { padding: 18px 15px; }
            .heading { font-size: 18px; padding-left: 10px; }
            .message { font-size: 13px; }
            .contact-bar { flex-direction: column; padding: 12px; gap: 8px; }
            .contact-col h4 { font-size: 10px; margin-bottom: 5px; }
            .contact-item { font-size: 8px; }
            .contact-item svg { width: 12px; height: 12px; }
            .social-icons a { width: 22px; height: 22px; }
            .support-buttons { flex-direction: column; align-items: stretch; }
            .support-btn { justify-content: center; }
            .footer-links { gap: 8px; }
            .footer-links a { font-size: 9px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="${logoUrl}" alt="BAT & PREFAB">
        </div>
        
        <div class="content">
            <div class="heading">${heading}</div>
            <div class="message">${body.replace(/\n/g, '<br>')}</div>
            ${link ? `<div style="text-align:center;"><a href="${link}" class="btn">VOIR LES DÉTAILS →</a></div>` : ''}
        </div>
        
        <div class="contact-bar">
            <div class="contact-col">
                <h4>NOUS CONTACTER</h4>
                <div class="contact-item">${svgIcons.phone} <a href="tel:+2250556121339">+225 05 56 12 13 39</a></div>
                <div class="contact-item">${svgIcons.phone} <a href="tel:+2250789855251">+225 07 89 85 52 51</a></div>
                <div class="contact-item">${svgIcons.phone} <a href="tel:+2252721399717">+225 27 21 39 97 17</a></div>
                <div class="contact-item" style="margin-top:6px;"><strong style="font-size:9px;">BURKINA FASO</strong></div>
                <div class="contact-item">${svgIcons.phone} <a href="tel:+22675240800">+226 75 24 08 00</a></div>
                <div class="contact-item" style="margin-top:6px;"><strong style="font-size:9px;">TOGO</strong></div>
                <div class="contact-item">${svgIcons.phone} <a href="tel:+22897106363">+228 97 10 63 63</a></div>
                <div class="contact-item" style="margin-top:6px;"><strong style="font-size:9px;">CAMEROUN</strong></div>
                <div class="contact-item">${svgIcons.phone} <a href="tel:+237677554561">+237 6 77 55 45 61</a></div>
                <div class="contact-item" style="margin-top:6px;">${svgIcons.email} <a href="mailto:contact@bat-prefab.com">contact@bat-prefab.com</a></div>
                <div class="contact-item">${svgIcons.location} Koumassi, bd du Gabon, Abidjan, CI</div>
            </div>
            <div class="contact-col">
                <h4>SUIVEZ-NOUS</h4>
                <div class="social-icons">
                    <a href="https://www.linkedin.com/company/bat-prefab" target="_blank">${svgIcons.linkedin}</a>
                    <a href="https://www.facebook.com/Batprefab.ci" target="_blank">${svgIcons.facebook}</a>
                    <a href="https://wa.me/2250556121339" target="_blank">${svgIcons.whatsapp}</a>
                </div>
                <div style="margin-top: 10px;">
                    <a href="https://www.goafricaonline.com/ci/581881-batprefab-construction-abidjan-cote-ivoire" style="color:#0066CC; font-size:10px; text-decoration:none; display:inline-flex; align-items:center;">
                        GO AFRICA ONLINE ${svgIcons.arrow}
                    </a>
                </div>
            </div>
        </div>

        <div class="support-buttons">
            <a href="https://www.bat-prefab.com/suivi/" class="support-btn">
                ${svgIcons.phone} Suivre ma commande
            </a>
            <a href="https://www.bat-prefab.com/contact" class="support-btn outline">
                ${svgIcons.email} Support SAV
            </a>
        </div>

        <div class="footer-links">
            <a href="https://www.bat-prefab.com/nos-realisations/">Nos réalisations</a>
            <a href="https://www.bat-prefab.com/catalogue/">Catalogue</a>
            <a href="https://www.bat-prefab.com/nos-services/">Services</a>
        </div>
        
        <div class="footer">
            © 2026 BAT & PREFAB. Tous droits réservés.<br>
            Construction préfabriquée – L'expertise acier et béton.<br>
            <a href="https://www.bat-prefab.com">www.bat-prefab.com</a>
        </div>
    </div>
</body>
</html>`;
}
function previewEmail() {
    const heading = document.getElementById('mail-heading')?.value || "Sans titre";
    const body = document.getElementById('mail-body')?.value || "Aucun message";
    const link = document.getElementById('mail-link')?.value || "";
    
    let box = document.getElementById('preview-box');
    if (!box) {
        box = document.createElement('div');
        box.id = 'preview-box';
        box.style.cssText = 'margin-top:20px; border-radius:12px; overflow:hidden;';
        document.querySelector('#view-send').appendChild(box);
    }
    
    let iframe = box.querySelector('iframe');
    if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.style.width = '100%';
        iframe.style.height = '600px';
        iframe.style.border = '1px solid #FFD700';
        iframe.style.borderRadius = '12px';
        iframe.style.background = '#fff';
        iframe.sandbox = 'allow-same-origin allow-scripts allow-popups allow-forms allow-modals';
        box.innerHTML = '';
        box.appendChild(iframe);
    }
    
    const htmlContent = generateEmailHTML(heading, body, link);
    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(htmlContent);
    doc.close();
    
    box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

async function sendCampaign() {
    if(!confirm("Envoyer a tous les abonnes ?")) return;
    const subject = document.getElementById('mail-subject').value;
    const heading = document.getElementById('mail-heading').value;
    const body = document.getElementById('mail-body').value;
    const link = document.getElementById('mail-link').value;
    const { data: subscribers, error: dbError } = await _supabase.from('newsletter').select('email');
    if (dbError || !subscribers || subscribers.length === 0) {
        alert("Erreur ou aucun abonne.");
        return;
    }
    const htmlContent = generateEmailHTML(heading, body, link);
    for (let sub of subscribers) {
        try {
            await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, { 
                to_email: sub.email, 
                subject: subject, 
                html_content: htmlContent 
            });
            document.getElementById('sending-log').innerText = `Envoye a : ${sub.email}`;
        } catch (err) { 
            console.error(err);
            alert("Erreur d'envoi a " + sub.email);
            break;
        }
        await new Promise(r => setTimeout(r, 500));
    }
    alert("Campagne terminee !");
}

async function loadChatSessions() {
    const { data: messagesData, error: msgsError } = await _supabase
        .from('messages')
        .select('session_id, client_name')
        .order('created_at', { ascending: false });

    if (msgsError || !messagesData) return;

    const nameMap = new Map();
    for (let msg of messagesData) {
        if (msg.client_name && !nameMap.has(msg.session_id)) {
            nameMap.set(msg.session_id, msg.client_name);
        }
    }

    const uniqueSessions = [...new Set(messagesData.map(m => m.session_id))];
    const container = document.getElementById('sessions-container');
    if (!container) return;

    if (uniqueSessions.length === 0) {
        container.innerHTML = "<div style='padding:15px;'>Aucune conversation</div>";
        return;
    }

    container.innerHTML = uniqueSessions.map(id => {
        const displayName = nameMap.get(id) || `Client #${id.substring(0,5)}`;
        return `<div class="session-item" style="padding:15px;border-bottom:1px solid #222;cursor:pointer;" onclick="selectSession('${id}')">${escapeHtml(displayName)}</div>`;
    }).join('');
}

async function selectSession(sessionId) {
    currentSelectedSession = sessionId;

    const { data: firstMsg } = await _supabase
        .from('messages')
        .select('client_name')
        .eq('session_id', sessionId)
        .not('client_name', 'is', null)
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle();

    const clientName = firstMsg?.client_name || sessionId.substring(0,8);
    document.getElementById('active-session-id').innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" style="vertical-align: middle; margin-right: 6px;"><use href="#icon-chat"/></svg> Chat avec : <strong>${escapeHtml(clientName)}</strong>`;

    const { data: messages } = await _supabase
        .from('messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

    const box = document.getElementById('admin-messages-box');
    if (box) {
        if (!messages || messages.length === 0) {
            box.innerHTML = "<div style='padding:20px; text-align:center;'>Aucun message pour cette conversation.</div>";
            return;
        }
        box.innerHTML = messages.map(m => {
            const isAdmin = m.sender_role === 'admin';
            const senderName = isAdmin ? 'Vous' : clientName;
            if (m.content && m.content.startsWith('CLIENT_NAME:')) return '';
            return `
                <div style="display: flex; justify-content: ${isAdmin ? 'flex-end' : 'flex-start'}; margin-bottom: 10px;">
                    <div style="max-width: 70%; background: ${isAdmin ? 'var(--blue)' : '#2c2c2c'}; color: ${isAdmin ? '#fff' : '#eee'}; padding: 10px; border-radius: 15px;">
                        <strong style="font-size:0.7rem;">${escapeHtml(senderName)}</strong><br>
                        ${escapeHtml(m.content)}
                        <div style="font-size:0.6rem; opacity:0.5; margin-top:4px;">${new Date(m.created_at).toLocaleTimeString()}</div>
                    </div>
                </div>
            `;
        }).join('');
        box.scrollTop = box.scrollHeight;
    }
}

async function sendAdminReply() {
    const input = document.getElementById('admin-reply-input');
    if (!input.value.trim() || !currentSelectedSession) return;
    await _supabase.from('messages').insert([{ content: input.value, sender_role: 'admin', session_id: currentSelectedSession }]);
    input.value = '';
    selectSession(currentSelectedSession); 
}

async function publishPromo() {
    const title = document.getElementById('promo-title').value;
    const message = document.getElementById('promo-message').value;
    const imgFile = document.getElementById('promo-img').files[0];
    const dateDebut = document.getElementById('promo-date-debut').value;
    const dateFin = document.getElementById('promo-date-fin').value;

    if (!title || !message) {
        alert("Veuillez remplir le titre et la description.");
        return;
    }

    try {
        let imageUrl = null;
        if (imgFile) {
            const imgName = `promo_${Date.now()}`;
            await _supabase.storage.from('realisations').upload(imgName, imgFile);
            imageUrl = _supabase.storage.from('realisations').getPublicUrl(imgName).data.publicUrl;
        }

        await _supabase.from('promotions').insert([{
            title,
            message,
            image_url: imageUrl,
            is_active: true,
            date_debut: dateDebut ? new Date(dateDebut).toISOString() : null,
            date_fin: dateFin ? new Date(dateFin).toISOString() : null
        }]);

        alert("Promotion publiée !");
        loadActivePromosList();
        document.getElementById('promo-title').value = '';
        document.getElementById('promo-message').value = '';
        document.getElementById('promo-img').value = '';
        document.getElementById('promo-date-debut').value = '';
        document.getElementById('promo-date-fin').value = '';
    } catch (err) {
        alert("Erreur : " + err.message);
    }
}

async function disablePromo() {
    if (!confirm("Desactiver toutes les promotions actives ?")) return;
    const { error } = await _supabase.from('promotions').update({ is_active: false }).eq('is_active', true);
    if (error) alert("Erreur : " + error.message);
    else {
        alert("Toutes les promotions ont ete desactivees.");
        loadActivePromosList();
    }
}

async function loadActivePromosList() {
    const container = document.getElementById('active-promos-list');
    if(!container) return;
    const { data } = await _supabase.from('promotions').select('*').eq('is_active', true).order('created_at', { ascending: false });
    container.innerHTML = (data || []).map(p => `<div style="background:#222;padding:15px;margin-bottom:10px;display:flex;justify-content:space-between;"><span>${p.title}</span><button onclick="deletePromo(${p.id})" style="background:red;color:white;border:none;cursor:pointer;">X</button></div>`).join('');
}

async function deletePromo(id) {
    const { data: promo, error: fetchError } = await _supabase
        .from('promotions')
        .select('title, image_url')
        .eq('id', id)
        .single();

    if (fetchError) {
        alert("Erreur lors de la récupération de la promotion : " + fetchError.message);
        return;
    }

    if (!confirm(`Supprimer définitivement la promotion "${promo.title}" et son image ?`)) return;

    try {
        if (promo.image_url) {
            const publicBase = _supabase.storage.from('realisations').getPublicUrl('').data.publicUrl;
            const relativePath = promo.image_url.replace(publicBase, '');

            if (relativePath) {
                const { error: storageError } = await _supabase.storage
                    .from('realisations')
                    .remove([relativePath]);

                if (storageError) {
                    console.warn("Erreur suppression fichier:", storageError);
                } else {
                    console.log("Image supprimée du storage :", relativePath);
                }
            }
        }

        const { error: deleteError } = await _supabase
            .from('promotions')
            .delete()
            .eq('id', id);

        if (deleteError) throw deleteError;

        alert("Promotion et son image supprimées définitivement.");
        loadActivePromosList();

    } catch (err) {
        alert("Erreur lors de la suppression : " + err.message);
    }
}

function openEditModal(id) {
    console.log("openEditModal appele avec id =", id);
    const modal = document.getElementById('editModal');
    if (!modal) {
        console.error("Modal #editModal introuvable !");
        return;
    }
    modal.style.display = 'flex';
    document.getElementById('edit-id').value = id;
    loadRealisationData(id);
}

function closeEditModal() {
    const modal = document.getElementById('editModal');
    if (modal) modal.style.display = 'none';
}

async function loadRealisationData(id) {
    try {
        console.log("Chargement des donnees pour l'id", id);
        const { data, error } = await _supabase.from('realisations').select('*').eq('id', id).single();
        if (error) throw error;
        if (!data) throw new Error("Aucune donnee");

        document.getElementById('edit-title').value = data.title || '';
        document.getElementById('edit-description').value = data.description || '';
        document.getElementById('edit-date').value = data.date_realisation || '';

        const gallery = data.gallery_urls || [];
        const container = document.getElementById('existing-images-container');
        if (gallery.length === 0) {
            container.innerHTML = '<div class="status-text">Aucune image actuellement.</div>';
        } else {
            container.innerHTML = gallery.map((url, idx) => `
                <div style="position:relative;display:inline-block;">
                    <img src="${url}" style="width:80px;height:80px;object-fit:cover;border-radius:12px;border:1px solid #444;">
                    <button onclick="removeImageFromGallery('${id}', '${url.replace(/'/g, "\\'")}', ${idx})" 
                        style="position:absolute;top:-8px;right:-8px;background:#dc3545;color:white;border:none;border-radius:50%;width:22px;height:22px;cursor:pointer;font-size:12px;">X</button>
                </div>
            `).join('');
        }
    } catch (err) {
        console.error("Erreur loadRealisationData :", err);
        alert("Impossible de charger les donnees : " + err.message);
    }
}

async function removeImageFromGallery(realisationId, imageUrl, index) {
    if (!confirm("Supprimer cette image ?")) return;
    const publicBase = _supabase.storage.from('realisations').getPublicUrl('').data.publicUrl;
    const relativePath = imageUrl.replace(publicBase, '');
    await _supabase.storage.from('realisations').remove([relativePath]).catch(e => console.warn(e));
    const { data: real, error } = await _supabase.from('realisations').select('gallery_urls, image_url').eq('id', realisationId).single();
    if (error) return alert("Erreur base : " + error.message);
    let gallery = real.gallery_urls || [];
    gallery = gallery.filter(url => url !== imageUrl);
    let newImageUrl = real.image_url;
    if (real.image_url === imageUrl && gallery.length > 0) newImageUrl = gallery[0];
    else if (real.image_url === imageUrl && gallery.length === 0) newImageUrl = null;
    const { error: updateError } = await _supabase.from('realisations').update({ gallery_urls: gallery, image_url: newImageUrl }).eq('id', realisationId);
    if (updateError) alert("Erreur mise a jour : " + updateError.message);
    else {
        loadRealisationData(realisationId);
        loadAdminRealisations();
    }
}

async function addImagesToGallery(realisationId, files) {
    if (!files.length) return [];
    const newUrls = [];
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `uploads/${Date.now()}_${Math.random()}_${i}.${fileExt}`;
        const { error: uploadError } = await _supabase.storage.from('realisations').upload(fileName, file);
        if (uploadError) throw uploadError;
        const { data: publicData } = _supabase.storage.from('realisations').getPublicUrl(fileName);
        newUrls.push(publicData.publicUrl);
    }
    return newUrls;
}

async function updateRealisation() {
    const id = document.getElementById('edit-id').value;
    const newTitle = document.getElementById('edit-title').value;
    const newDesc = document.getElementById('edit-description').value;
    const newDate = document.getElementById('edit-date').value;
    const newFiles = document.getElementById('edit-new-images').files;
    const newVideoFile = document.getElementById('edit-new-video')?.files[0];
    if (!newTitle) return alert("Le titre est obligatoire.");
    const { data: current, error: fetchError } = await _supabase.from('realisations').select('gallery_urls, image_url, video_url').eq('id', id).single();
    if (fetchError) return alert("Erreur chargement : " + fetchError.message);
    let gallery = current.gallery_urls || [];
    let firstImage = current.image_url;
    let firstVideo = current.video_url;
    if (newFiles.length > 0) {
        const newUrls = await addImagesToGallery(id, newFiles);
        gallery.push(...newUrls);
        if (!firstImage && newUrls.length) firstImage = newUrls[0];
    }
    if (newVideoFile) {
        const fileExt = newVideoFile.name.split('.').pop();
        const fileName = `uploads/video_${Date.now()}.${fileExt}`;
        const { error: uploadError } = await _supabase.storage.from('realisations').upload(fileName, newVideoFile);
        if (!uploadError) {
            const { data: publicData } = _supabase.storage.from('realisations').getPublicUrl(fileName);
            firstVideo = publicData.publicUrl;
        } else alert("Erreur upload video");
    }
    if (gallery.length > 0 && !firstImage) firstImage = gallery[0];
    else if (gallery.length === 0) firstImage = null;
    const updatePayload = { title: newTitle, description: newDesc, date_realisation: newDate || null, gallery_urls: gallery, image_url: firstImage, video_url: firstVideo };
    const { error: updateError } = await _supabase.from('realisations').update(updatePayload).eq('id', id);
    if (updateError) alert("Erreur mise a jour : " + updateError.message);
    else {
        alert("Modifications enregistrees !");
        closeEditModal();
        loadAdminRealisations();
        document.getElementById('edit-new-images').value = '';
        if(document.getElementById('edit-new-video')) document.getElementById('edit-new-video').value = '';
    }
}

async function loadAdminRealisations() {
    const container = document.getElementById('admin-realisations-list');
    if (!container) return;
    container.innerHTML = "<p>Chargement...</p>";
    try {
        const { data, error } = await _supabase.from('realisations').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        if (!data || data.length === 0) {
            container.innerHTML = "<p>Aucun projet trouve.</p>";
            return;
        }
        let html = `<table style="width:100%; border-collapse: collapse; margin-top:20px; color:white; font-size:0.85rem;">
            <thead><tr style="border-bottom: 2px solid var(--yellow); text-align:left;">
                <th style="padding:8px;">Media</th>
                <th style="padding:8px;">Titre</th>
                <th style="padding:8px;">Actions</th>
            </tr></thead><tbody>`;
        data.forEach(proj => {
            const thumb = proj.image_url || (proj.gallery_urls && proj.gallery_urls[0]) || 'https://via.placeholder.com/50';
            html += `<tr style="border-bottom: 1px solid #333;">
                <td style="padding:8px;"><img src="${thumb}" style="width:50px;height:50px;object-fit:cover;border-radius:4px;" onerror="this.src='https://via.placeholder.com/50'"></td>
                <td style="padding:8px;">${escapeHtml(proj.title)}</td>
                <td style="padding:8px;">
                    <button data-id="${proj.id}" data-action="edit" style="background:#FFD700;color:#000;border:none;padding:6px 12px;border-radius:6px;margin-right:8px;cursor:pointer;">Modifier</button>
                    <button data-id="${proj.id}" data-action="delete" style="background:#dc3545;color:white;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;">Supprimer</button>
                 </td>
             </tr>`;
        });
        html += `</tbody><table>`;
        container.innerHTML = html;
        console.log("Liste des projets affichee (sans colonne Accueil)");
    } catch (err) {
        console.error("Erreur loadAdminRealisations :", err);
        container.innerHTML = "<p style='color:red;'>Erreur : " + err.message + "</p>";
    }
}

document.addEventListener('click', function(e) {
    const btn = e.target.closest('button');
    if (!btn) return;
    const action = btn.getAttribute('data-action');
    const id = btn.getAttribute('data-id');
    if (!id) return;

    if (action === 'edit') {
        e.preventDefault();
        console.log("Clic sur Modifier, id =", id);
        openEditModal(id);
    } else if (action === 'delete') {
        e.preventDefault();
        console.log("Clic sur Supprimer, id =", id);
        deleteRealisation(id);
    } 
});

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

async function loadMessages() {
    const container = document.getElementById('messages-container');
    if (!container) return;

    let query = _supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

    if (currentFilter !== 'all') {
        query = query.eq('status', currentFilter);
    }

    const { data, error } = await query;
    if (error) {
        console.error(error);
        container.innerHTML = "Erreur de chargement.";
        return;
    }

    if (!data.length) {
        container.innerHTML = "Aucune demande recue.";
        return;
    }

    container.innerHTML = data.map(msg => `
        <div class="message-item" style="border-left-color: ${getStatusColor(msg.status)};">
            <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
                <div>
                    <strong>${escapeHtml(msg.nom)}</strong> — ${escapeHtml(msg.email)}<br>
                    <strong>Tel :</strong> ${escapeHtml(msg.telephone)}<br>
                    <strong>Categorie :</strong> ${escapeHtml(msg.categorie || 'Non specifiee')}
                </div>
                <div style="text-align: right;">
                    <select data-id="${msg.id}" class="status-select" style="background: #2c2c2c; border: 1px solid #444; padding: 5px 10px; border-radius: 20px;">
                        <option value="en_attente" ${msg.status === 'en_attente' ? 'selected' : ''}>En attente</option>
                        <option value="en_cours" ${msg.status === 'en_cours' ? 'selected' : ''}>En cours</option>
                        <option value="traite" ${msg.status === 'traite' ? 'selected' : ''}>Traite</option>
                    </select>
                    <button onclick="deleteContactMessage('${msg.id}')" style="background:#dc3545; color:white; border:none; border-radius: 20px; padding: 4px 12px; margin-left: 8px;">Supprimer</button>
                </div>
            </div>
            <div style="margin-top: 10px; padding: 10px; background: #111;">${escapeHtml(msg.message)}</div>
            <small>${new Date(msg.created_at).toLocaleString()}</small>
        </div>
    `).join('');

    document.querySelectorAll('.status-select').forEach(select => {
        select.removeEventListener('change', handleStatusChange);
        select.addEventListener('change', handleStatusChange);
    });
}

function handleStatusChange(e) {
    const select = e.target;
    const id = select.getAttribute('data-id');
    const newStatus = select.value;
    updateMessageStatus(id, newStatus);
}

async function updateMessageStatus(id, newStatus) {
    const { error } = await _supabase
        .from('contacts')
        .update({ status: newStatus })
        .eq('id', id);
    if (error) {
        console.error(error);
        alert("Erreur lors de la mise a jour du statut.");
    } else {
        await loadMessages();
    }
}

async function deleteContactMessage(id) {
    if (!confirm("Supprimer definitivement cette demande ?")) return;
    const { error } = await _supabase.from('contacts').delete().eq('id', id);
    if (error) alert("Erreur suppression");
    else await loadMessages();
}

async function filterMessages(status) {
    currentFilter = status;
    await loadMessages();
}

_supabase.channel('admin-realtime').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
    if (payload.new.sender_role === 'user') {
        adminSound.play(); 
        document.title = "NOUVEAU MESSAGE !";
        setTimeout(() => { document.title = "Admin - BAT & PREFAB"; }, 3000);
    }
    loadChatSessions(); 
    if (payload.new.session_id === currentSelectedSession) selectSession(currentSelectedSession);
}).subscribe();

async function genererNumeroUnique() {
    const annee = new Date().getFullYear();
    const prefix = `PREFAB-${annee}`;
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    const numero = `${prefix}-${randomPart}`;
    const { data, error } = await _supabaseGest
        .from('projets')
        .select('numero_unique')
        .eq('numero_unique', numero)
        .maybeSingle();
    if (data) return genererNumeroUnique();
    return numero;
}

async function getProjets(filters = {}) {
    let query = _supabaseGest.from('projets').select('*');
    if (filters.numero) {
        query = query.ilike('numero_unique', `%${filters.numero}%`);
    }
    if (filters.nom) {
        query = query.ilike('nom_client', `%${filters.nom}%`);
    }
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data;
}

async function createProjet(projet) {
    if (!projet.numero_unique) {
        projet.numero_unique = await genererNumeroUnique();
    }
    const { data, error } = await _supabaseGest
        .from('projets')
        .insert([projet])
        .select();
    if (error) throw error;
    return data[0];
}

async function updateProjet(id, updates) {
    const { data, error } = await _supabaseGest
        .from('projets')
        .update(updates)
        .eq('id', id)
        .select();
    if (error) throw error;
    return data[0];
}

async function deleteProjet(id) {
    const { error } = await _supabaseGest
        .from('projets')
        .delete()
        .eq('id', id);
    if (error) throw error;
}

async function getEtapes(projetId) {
    const { data, error } = await _supabaseGest
        .from('etapes')
        .select('*')
        .eq('projet_id', projetId)
        .order('ordre', { ascending: true });
    if (error) throw error;
    return data;
}

async function createEtape(etape) {
    const { data, error } = await _supabaseGest
        .from('etapes')
        .insert([etape])
        .select();
    if (error) throw error;
    return data[0];
}

async function updateEtape(id, updates) {
    const { data, error } = await _supabaseGest
        .from('etapes')
        .update(updates)
        .eq('id', id)
        .select();
    if (error) throw error;
    return data[0];
}

async function deleteEtape(id) {
    const { error } = await _supabaseGest
        .from('etapes')
        .delete()
        .eq('id', id);
    if (error) throw error;
}

async function loadProjetsList() {
    const container = document.getElementById('projets-list-container');
    if (!container) return;
    
    const searchNumero = document.getElementById('search-numero')?.value.trim() || '';
    const searchNom = document.getElementById('search-nom')?.value.trim() || '';
    
    container.innerHTML = '<p>Chargement...</p>';
    try {
        const projets = await getProjets({ numero: searchNumero, nom: searchNom });
        if (projets.length === 0) {
            container.innerHTML = '<p>Aucun projet trouve.</p>';
            return;
        }
        let html = `<table style="width:100%; border-collapse: collapse;">
            <thead><tr style="border-bottom:2px solid var(--yellow);">
                <th>Numero</th><th>Client</th><th>Statut</th><th>Dates</th><th>Facture</th><th>Actions</th>
            </td></thead><tbody>`;
        projets.forEach(p => {
            html += `<tr style="border-bottom:1px solid #333;">
                <td style="padding:10px;"><strong>${escapeHtml(p.numero_unique)}</strong></td>
                <td style="padding:10px;">${escapeHtml(p.nom_client)}</td>
                <td style="padding:10px;">${getBadgeStatut(p.statut_global)}</td>
                <td style="padding:10px;">${p.date_debut_prevue || ''} → ${p.date_fin_prevue || ''}</td>
                <td style="padding:10px;">
                    ${p.facture_url ? `<a href="${p.facture_url}" target="_blank" class="btn-secondary" style="padding:4px 8px; margin-right:5px;">Voir PDF</a>` : ''}
                    <button onclick="showFactureUpload('${p.id}')" class="btn-secondary" style="padding:4px 8px;">${p.facture_url ? 'Remplacer' : 'Ajouter'}</button>
                </td>
                <td style="padding:10px;">
                    <button onclick="openEtapesModal('${p.id}')" class="btn-secondary" style="padding:4px 12px; margin-right:5px;">Etapes</button>
                    <button onclick="editProjet('${p.id}')" class="btn-secondary" style="padding:4px 12px;">modifier</button>
                    <button onclick="deleteProjetConfirm('${p.id}')" class="btn-warning" style="padding:4px 12px;">Supprimer</button>
                </td>
            </tr>`;
        });
        html += `</tbody></table>`;
        container.innerHTML = html;
    } catch (err) {
        container.innerHTML = `<p style="color:red;">Erreur : ${err.message}</p>`;
    }
}

function resetSearch() {
    const inputNumero = document.getElementById('search-numero');
    const inputNom = document.getElementById('search-nom');
    if (inputNumero) inputNumero.value = '';
    if (inputNom) inputNom.value = '';
    loadProjetsList();
}

async function showFactureUpload(projetId) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/pdf';
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `factures/${projetId}_${Date.now()}.${fileExt}`;
            const { error: uploadError } = await _supabaseGest.storage.from('factures').upload(fileName, file);
            if (uploadError) throw uploadError;
            const { data: publicData } = _supabaseGest.storage.from('factures').getPublicUrl(fileName);
            await updateFactureUrl(projetId, publicData.publicUrl);
            alert("Facture ajoutee !");
            loadProjetsList();
        } catch (err) {
            alert("Erreur : " + err.message);
        }
    };
    input.click();
}

async function updateFactureUrl(projetId, url) {
    const { error } = await _supabaseGest.from('projets').update({ facture_url: url }).eq('id', projetId);
    if (error) throw error;
}

function getBadgeStatut(statut) {
    switch(statut) {
        case 'en_attente': return '<span style="color:#ffc107;">En attente</span>';
        case 'en_cours': return '<span style="color:#17a2b8;">En cours</span>';
        case 'termine': return '<span style="color:#28a745;">Termine</span>';
        default: return statut;
    }
}

async function showNewProjetForm() {
    document.getElementById('projetModalTitle').innerText = 'Creer un projet';
    document.getElementById('edit-projet-id').value = '';
    document.getElementById('projet-nom-client').value = '';
    document.getElementById('projet-description').value = '';
    document.getElementById('projet-date-debut').value = '';
    document.getElementById('projet-date-fin').value = '';
    document.getElementById('projet-statut').value = 'en_attente';
    document.getElementById('projet-numero').innerHTML = '';
    document.getElementById('projetModal').style.display = 'flex';
}

async function editProjet(id) {
    const { data, error } = await _supabaseGest.from('projets').select('*').eq('id', id).single();
    if (error) { alert(error.message); return; }
    document.getElementById('projetModalTitle').innerText = 'Modifier le projet';
    document.getElementById('edit-projet-id').value = data.id;
    document.getElementById('projet-nom-client').value = data.nom_client || '';
    document.getElementById('projet-description').value = data.description || '';
    document.getElementById('projet-date-debut').value = data.date_debut_prevue || '';
    document.getElementById('projet-date-fin').value = data.date_fin_prevue || '';
    document.getElementById('projet-statut').value = data.statut_global || 'en_attente';
    document.getElementById('projet-numero').innerHTML = `Numero : ${data.numero_unique}`;
    document.getElementById('projetModal').style.display = 'flex';
}

async function saveProjet() {
    const id = document.getElementById('edit-projet-id').value;
    const projet = {
        nom_client: document.getElementById('projet-nom-client').value.trim(),
        description: document.getElementById('projet-description').value,
        date_debut_prevue: document.getElementById('projet-date-debut').value || null,
        date_fin_prevue: document.getElementById('projet-date-fin').value || null,
        statut_global: document.getElementById('projet-statut').value
    };
    if (!projet.nom_client) { alert("Le nom du client est obligatoire."); return; }
    try {
        let factureUrl = null;
        const factureFile = document.getElementById('projet-facture').files[0];
        if (factureFile) {
            const fileExt = factureFile.name.split('.').pop();
            const fileName = `factures/${id || 'new'}_${Date.now()}.${fileExt}`;
            const { error: uploadError } = await _supabaseGest.storage.from('factures').upload(fileName, factureFile);
            if (uploadError) throw uploadError;
            const { data: publicData } = _supabaseGest.storage.from('factures').getPublicUrl(fileName);
            factureUrl = publicData.publicUrl;
        }
        if (id) {
            if (factureUrl) projet.facture_url = factureUrl;
            await updateProjet(id, projet);
        } else {
            const newProjet = await createProjet(projet);
            if (factureUrl) {
                await updateFactureUrl(newProjet.id, factureUrl);
            }
        }
        closeProjetModal();
        loadProjetsList();
    } catch (err) {
        alert("Erreur : " + err.message);
    }
}

function closeProjetModal() {
    document.getElementById('projetModal').style.display = 'none';
}

async function deleteProjetConfirm(id) {
    if (!confirm("Supprimer definitivement ce projet et toutes ses etapes ?")) return;
    try {
        await deleteProjet(id);
        loadProjetsList();
    } catch (err) {
        alert("Erreur : " + err.message);
    }
}

async function openEtapesModal(projetId) {
    currentProjetIdForEtapes = projetId;
    const { data: projet } = await _supabaseGest.from('projets').select('numero_unique, nom_client').eq('id', projetId).single();
    document.getElementById('etapesModalTitle').innerHTML = `Etapes - ${projet.numero_unique} (${projet.nom_client})`;
    await loadEtapesList(projetId);
    document.getElementById('etapesModal').style.display = 'flex';
}

async function loadEtapesList(projetId) {
    const container = document.getElementById('etapes-list');
    container.innerHTML = '<p>Chargement...</p>';
    try {
        const etapes = await getEtapes(projetId);
        if (etapes.length === 0) {
            container.innerHTML = '<p>Aucune etape pour le moment. Ajoutez-en ci-dessous.</p>';
            return;
        }
        let html = '<div style="display:flex; flex-direction:column; gap:15px;">';
        etapes.forEach(e => {
            html += `
                <div style="background:#111; border-radius:16px; padding:12px 16px; border-left:4px solid ${getCouleurStatut(e.statut)}">
                    <div style="display:flex; justify-content:space-between;">
                        <strong>${escapeHtml(e.titre)}</strong>
                        <div>
                            <select data-id="${e.id}" class="etape-statut-select" style="background:#2c2c2c; border-radius:20px; padding:4px 8px; margin-right:8px;">
                                <option value="a_faire" ${e.statut === 'a_faire' ? 'selected' : ''}>A faire</option>
                                <option value="en_cours" ${e.statut === 'en_cours' ? 'selected' : ''}>En cours</option>
                                <option value="termine" ${e.statut === 'termine' ? 'selected' : ''}>Termine</option>
                            </select>
                            <button onclick="deleteEtapeItem('${e.id}')" class="btn-warning" style="padding:4px 10px;">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><use href="#icon-trash"/></svg>
                            </button>
                        </div>
                    </div>
                    <p style="margin-top:8px; font-size:0.85rem;">${escapeHtml(e.description || '')}</p>
                    ${e.image_url ? `<div style="margin:8px 0;"><img src="${e.image_url}" style="max-width:100%; max-height:150px; border-radius:12px; cursor:pointer;" onclick="window.open('${e.image_url}')"><br>
                    <button onclick="deleteEtapeMedia('${e.id}', 'image')" class="btn-secondary" style="margin-top:4px; padding:2px 8px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><use href="#icon-trash"/></svg> Supprimer l'image</button></div>` : ''}
                    ${e.video_url ? `<div style="margin:8px 0;"><video src="${e.video_url}" controls style="max-width:100%; max-height:150px; border-radius:12px;"></video><br>
                    <button onclick="deleteEtapeMedia('${e.id}', 'video')" class="btn-secondary" style="margin-top:4px; padding:2px 8px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><use href="#icon-trash"/></svg> Supprimer la video</button></div>` : ''}
                    <div style="margin-top: 12px; display: flex; gap: 10px; flex-wrap: wrap;">
                        <input type="file" id="img-upload-${e.id}" accept="image/*" style="display:none;" onchange="uploadEtapeMedia('${e.id}', 'image', this)">
                        <button onclick="document.getElementById('img-upload-${e.id}').click()" class="btn-secondary" style="padding:4px 12px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><use href="#icon-image"/></svg> Ajouter/remplacer image</button>
                        <input type="file" id="vid-upload-${e.id}" accept="video/*" style="display:none;" onchange="uploadEtapeMedia('${e.id}', 'video', this)">
                        <button onclick="document.getElementById('vid-upload-${e.id}').click()" class="btn-secondary" style="padding:4px 12px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><use href="#icon-video"/></svg> Ajouter/remplacer video</button>
                    </div>
                    ${e.latitude && e.longitude ? `<div style="font-size:0.7rem; color:#aaa;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle;"><use href="#icon-location"/></svg> ${e.latitude}, ${e.longitude}</div>` : ''}
                    <div style="font-size:0.7rem; color:#aaa; margin-top:6px;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle;"><use href="#icon-calendar"/></svg> ${e.date_debut || ''} → ${e.date_fin || ''}</div>
                </div>
            `;
        });
        html += '</div>';
        container.innerHTML = html;
        document.querySelectorAll('.etape-statut-select').forEach(select => {
            select.addEventListener('change', async (e) => {
                const etapeId = select.getAttribute('data-id');
                const newStatut = select.value;
                await updateEtape(etapeId, { statut: newStatut });
                loadEtapesList(projetId);
            });
        });
    } catch (err) {
        container.innerHTML = `<p style="color:red;">Erreur : ${err.message}</p>`;
    }
}

async function uploadEtapeMedia(etapeId, type, fileInput) {
    const file = fileInput.files[0];
    if (!file) return;
    
    if (type === 'image' && !file.type.startsWith('image/')) {
        alert("Veuillez selectionner une image valide.");
        return;
    }
    if (type === 'video' && !file.type.startsWith('video/')) {
        alert("Veuillez selectionner une video valide.");
        return;
    }
    
    const { data: etape } = await _supabaseGest
        .from('etapes')
        .select(type === 'image' ? 'image_url' : 'video_url')
        .eq('id', etapeId)
        .single();
    const oldUrl = etape?.[type === 'image' ? 'image_url' : 'video_url'];
    if (oldUrl) {
        const publicBase = _supabaseGest.storage.from('etapes').getPublicUrl('').data.publicUrl;
        const oldPath = oldUrl.replace(publicBase, '');
        await _supabaseGest.storage.from('etapes').remove([oldPath]).catch(e => console.warn(e));
    }
    
    try {
        const ext = file.name.split('.').pop();
        const fileName = `etapes/${etapeId}_${Date.now()}_${type}.${ext}`;
        
        const { error: uploadError } = await _supabaseGest.storage.from('etapes').upload(fileName, file);
        if (uploadError) throw uploadError;
        
        const { data: publicData } = _supabaseGest.storage.from('etapes').getPublicUrl(fileName);
        const fileUrl = publicData.publicUrl;
        
        const updateData = {};
        if (type === 'image') updateData.image_url = fileUrl;
        else updateData.video_url = fileUrl;
        
        const { error: updateError } = await _supabaseGest
            .from('etapes')
            .update(updateData)
            .eq('id', etapeId);
        if (updateError) throw updateError;
        
        await loadEtapesList(currentProjetIdForEtapes);
        document.getElementById('etapes-message').innerHTML = `${type === 'image' ? 'Image' : 'Video'} ajoutee/modifiee.`;
        setTimeout(() => document.getElementById('etapes-message').innerHTML = '', 3000);
    } catch (err) {
        alert("Erreur upload : " + err.message);
    }
}

function getCouleurStatut(statut) {
    switch(statut) {
        case 'a_faire': return '#ffc107';
        case 'en_cours': return '#17a2b8';
        case 'termine': return '#28a745';
        default: return '#666';
    }
}

async function addEtape() {
    const titre = document.getElementById('new-etape-titre').value.trim();
    if (!titre) { alert("Le titre de l'etape est requis."); return; }
    const description = document.getElementById('new-etape-desc').value;
    const statut = document.getElementById('new-etape-statut').value;
    const lat = parseFloat(document.getElementById('new-etape-lat').value);
    const lon = parseFloat(document.getElementById('new-etape-lon').value);
    const date_debut = document.getElementById('new-etape-date-debut').value || null;
    const date_fin = document.getElementById('new-etape-date-fin').value || null;
    const imageFile = document.getElementById('new-etape-image').files[0];
    const videoFile = document.getElementById('new-etape-video').files[0];
    
    let imageUrl = null;
    let videoUrl = null;
    
    try {
        if (imageFile) {
            const ext = imageFile.name.split('.').pop();
            const fileName = `etapes/${currentProjetIdForEtapes}_${Date.now()}_img.${ext}`;
            const { error: upImg } = await _supabaseGest.storage.from('etapes').upload(fileName, imageFile);
            if (upImg) throw upImg;
            const { data: pubImg } = _supabaseGest.storage.from('etapes').getPublicUrl(fileName);
            imageUrl = pubImg.publicUrl;
        }
        if (videoFile) {
            const ext = videoFile.name.split('.').pop();
            const fileName = `etapes/${currentProjetIdForEtapes}_${Date.now()}_vid.${ext}`;
            const { error: upVid } = await _supabaseGest.storage.from('etapes').upload(fileName, videoFile);
            if (upVid) throw upVid;
            const { data: pubVid } = _supabaseGest.storage.from('etapes').getPublicUrl(fileName);
            videoUrl = pubVid.publicUrl;
        }
        
        const etapesExistantes = await getEtapes(currentProjetIdForEtapes);
        const ordre = etapesExistantes.length;
        
        const nouvelleEtape = {
            projet_id: currentProjetIdForEtapes,
            titre,
            description,
            statut,
            ordre,
            latitude: isNaN(lat) ? null : lat,
            longitude: isNaN(lon) ? null : lon,
            date_debut,
            date_fin,
            image_url: imageUrl,
            video_url: videoUrl,
            gallery_urls: []
        };
        
        await createEtape(nouvelleEtape);
        
        document.getElementById('new-etape-titre').value = '';
        document.getElementById('new-etape-desc').value = '';
        document.getElementById('new-etape-lat').value = '';
        document.getElementById('new-etape-lon').value = '';
        document.getElementById('new-etape-date-debut').value = '';
        document.getElementById('new-etape-date-fin').value = '';
        document.getElementById('new-etape-statut').value = 'a_faire';
        document.getElementById('new-etape-image').value = '';
        document.getElementById('new-etape-video').value = '';
        
        loadEtapesList(currentProjetIdForEtapes);
        document.getElementById('etapes-message').innerHTML = 'Etape ajoutee.';
        setTimeout(() => document.getElementById('etapes-message').innerHTML = '', 3000);
    } catch (err) {
        alert("Erreur : " + err.message);
    }
}

async function deleteEtapeItem(etapeId) {
    if (!confirm("Supprimer cette etape ?")) return;
    await deleteEtape(etapeId);
    loadEtapesList(currentProjetIdForEtapes);
}

async function deleteEtapeMedia(etapeId, type) {
    if (!confirm(`Supprimer definitivement ${type === 'image' ? "l'image" : "la video"} de cette etape ?`)) return;
    try {
        const { data: etape, error } = await _supabaseGest
            .from('etapes')
            .select('image_url, video_url')
            .eq('id', etapeId)
            .single();
        if (error) throw error;
        
        let updateField = {};
        let fileUrl = null;
        if (type === 'image' && etape.image_url) {
            fileUrl = etape.image_url;
            updateField = { image_url: null };
        } else if (type === 'video' && etape.video_url) {
            fileUrl = etape.video_url;
            updateField = { video_url: null };
        } else {
            alert("Aucun media de ce type a supprimer.");
            return;
        }
        
        const publicBase = _supabaseGest.storage.from('etapes').getPublicUrl('').data.publicUrl;
        const relativePath = fileUrl.replace(publicBase, '');
        await _supabaseGest.storage.from('etapes').remove([relativePath]).catch(e => console.warn(e));
        
        await _supabaseGest.from('etapes').update(updateField).eq('id', etapeId);
        
        loadEtapesList(currentProjetIdForEtapes);
    } catch (err) {
        alert("Erreur : " + err.message);
    }
}

function closeEtapesModal() {
    document.getElementById('etapesModal').style.display = 'none';
    currentProjetIdForEtapes = null;
}

async function loadSavProjets() {
    const { data: chats, error } = await _supabaseGest
        .from('chat_sav')
        .select('projet_id, client_name, created_at')
        .order('created_at', { ascending: false });

    if (error) {
        console.error(error);
        return;
    }
    const projetIds = [...new Set(chats.map(c => c.projet_id))];
    if (projetIds.length === 0) {
        document.getElementById('sav-projets-list').innerHTML = '<div style="padding:15px;">Aucune conversation</div>';
        return;
    }
    const { data: projets } = await _supabaseGest
        .from('projets')
        .select('id, numero_unique, nom_client')
        .in('id', projetIds);
    const mapProjets = new Map(projets.map(p => [p.id, p]));

    const container = document.getElementById('sav-projets-list');
    container.innerHTML = '';
    for (let pid of projetIds) {
        const projet = mapProjets.get(pid);
        const displayName = projet ? `${projet.nom_client} (${projet.numero_unique})` : `Projet #${pid}`;
        container.innerHTML += `
            <div class="sav-projet-item" data-projet="${pid}" style="padding:15px; border-bottom:1px solid #222; cursor:pointer;">
                <strong>${escapeHtml(displayName)}</strong><br>
                <small style="color:#666;">Dernier message: ${new Date(chats.find(c => c.projet_id === pid)?.created_at).toLocaleString()}</small>
            </div>
        `;
    }
    document.querySelectorAll('.sav-projet-item').forEach(el => {
        el.addEventListener('click', () => selectSavProjet(el.dataset.projet));
    });
}

async function selectSavProjet(projetId) {
    currentSavProjetId = projetId;
    const { data: projet } = await _supabaseGest
        .from('projets')
        .select('numero_unique, nom_client')
        .eq('id', projetId)
        .single();
    currentSavClientName = projet.nom_client;
    currentSavNumero = projet.numero_unique;
    document.getElementById('sav-active-info').innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" style="vertical-align: middle; margin-right: 6px;"><use href="#icon-chat"/></svg> Projet : ${currentSavNumero} - Client : <strong>${escapeHtml(currentSavClientName)}</strong>`;

    const { data: messages } = await _supabaseGest
        .from('chat_sav')
        .select('*')
        .eq('projet_id', projetId)
        .order('created_at', { ascending: true });

    const box = document.getElementById('sav-messages-box');
    if (!box) return;
    if (!messages || messages.length === 0) {
        box.innerHTML = "<div style='padding:20px;text-align:center;'>Aucun message.</div>";
        return;
    }
    box.innerHTML = messages.map(m => {
        const isAdmin = m.sender === 'admin';
        const senderName = isAdmin ? 'Vous' : (m.client_name || 'Client');
        if (m.message && m.message.startsWith('CLIENT_NAME:')) return '';
        let mediaHtml = '';
        if (m.file_url && m.file_type) {
            if (m.file_type.startsWith('image/')) {
                mediaHtml = `<img src="${m.file_url}" style="max-width:150px; border-radius:8px; margin-top:5px; cursor:pointer;" onclick="window.open('${m.file_url}')">`;
            } else if (m.file_type.startsWith('video/')) {
                mediaHtml = `<video src="${m.file_url}" controls style="max-width:150px; border-radius:8px; margin-top:5px;"></video>`;
            } else {
                mediaHtml = `<a href="${m.file_url}" target="_blank"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><use href="#icon-attach"/></svg> Telecharger</a>`;
            }
        }
        return `
            <div style="display: flex; justify-content: ${isAdmin ? 'flex-end' : 'flex-start'}; margin-bottom: 10px;">
                <div style="max-width: 70%; background: ${isAdmin ? 'var(--blue)' : '#2c2c2c'}; color: ${isAdmin ? '#fff' : '#eee'}; padding: 10px; border-radius: 15px;">
                    <strong style="font-size:0.7rem;">${escapeHtml(senderName)}</strong><br>
                    ${escapeHtml(m.message || '')}
                    ${mediaHtml}
                    <div style="font-size:0.6rem; opacity:0.5; margin-top:4px;">${new Date(m.created_at).toLocaleTimeString()}</div>
                </div>
            </div>
        `;
    }).join('');
    box.scrollTop = box.scrollHeight;
}

document.getElementById('sav-reply-file')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const fileNameSpan = document.getElementById('sav-file-name');
    if (!file) {
        savPendingFile = null;
        if (fileNameSpan) fileNameSpan.textContent = '';
        return;
    }
    savPendingFile = file;
    if (fileNameSpan) {
        const fileType = file.type.startsWith('image/') ? '🖼️' : (file.type.startsWith('video/') ? '🎬' : '📎');
        fileNameSpan.innerHTML = `${fileType} ${escapeHtml(file.name)}`;
    }
    console.log("Fichier joint :", file.name);
});

async function sendSavReply() {
    const input = document.getElementById('sav-reply-input');
    const message = input.value.trim();
    if (!message && !savPendingFile) return;
    if (!currentSavProjetId) return;

    let fileUrl = null, fileType = null;
    if (savPendingFile) {
        try {
            const ext = savPendingFile.name.split('.').pop();
            const fileName = `chat_sav/${currentSavProjetId}_admin_${Date.now()}.${ext}`;
            const { error: uploadError } = await _supabaseGest.storage.from('chat_sav').upload(fileName, savPendingFile);
            if (uploadError) throw uploadError;
            const { data: pubData } = _supabaseGest.storage.from('chat_sav').getPublicUrl(fileName);
            fileUrl = pubData.publicUrl;
            fileType = savPendingFile.type;
            savPendingFile = null;
            document.getElementById('sav-reply-file').value = '';
        } catch (err) {
            console.error(err);
            alert("Erreur upload fichier");
            return;
        }
    }

    const { error } = await _supabaseGest.from('chat_sav').insert([{
        projet_id: currentSavProjetId,
        session_id: 'admin_session',
        client_name: currentSavClientName,
        message: message || '',
        sender: 'admin',
        file_url: fileUrl,
        file_type: fileType
    }]);

    if (error) {
        console.error(error);
        alert("Erreur envoi message");
    } else {
        input.value = '';
        selectSavProjet(currentSavProjetId);
    }
    const fileInput = document.getElementById('sav-reply-file');
    if (fileInput) fileInput.value = '';
    const fileNameSpan = document.getElementById('sav-file-name');
    if (fileNameSpan) fileNameSpan.textContent = '';
    savPendingFile = null;
}

_supabaseGest
  .channel('sav-realtime')
  .on(
    'postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'chat_sav' },
    (payload) => {
      console.log('Nouveau message SAV recu en temps reel', payload.new);
      loadSavProjets();
      if (currentSavProjetId && payload.new.projet_id == currentSavProjetId) {
        selectSavProjet(currentSavProjetId);
      }
      if (payload.new.sender === 'client') {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/1359/1359-preview.mp3');
        audio.play().catch(() => {});
        document.title = "NOUVEAU MESSAGE SAV !";
        setTimeout(() => { document.title = "Admin - BAT & PREFAB"; }, 3000);
      }
    }
  )
  .subscribe();

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM charge, initialisation...");
    emailjs.init(EMAILJS_PUBLIC_KEY);
    checkSession();
    
    const adminInput = document.getElementById('admin-reply-input');
    if (adminInput) adminInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendAdminReply(); });
    
    const savMessagesBox = document.getElementById('sav-messages-box');
    if (savMessagesBox) {
        savMessagesBox.addEventListener('click', function(e) {
            const img = e.target.closest('.message-bubble img');
            const video = e.target.closest('.message-bubble video');
            if (img) {
                e.preventDefault();
                window.open(img.src, '_blank');
            } else if (video && video.src) {
                e.preventDefault();
                window.open(video.src, '_blank');
            }
        });
    }
});