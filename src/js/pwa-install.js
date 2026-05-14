// ========================================
// PWA INSTALL BANNER PROFISSIONAL
// ========================================

// Variáveis globais
let deferredPrompt = null;
let installButton = null;
let installCard = null;
let isInstalled = false;

// Detectar se já está instalado
function checkIfInstalled() {
    if (window.matchMedia('(display-mode: standalone)').matches || 
        window.navigator.standalone === true) {
        isInstalled = true;
        return true;
    }
    return false;
}

// Criar o card de instalação
function createInstallCard() {
    // Verificar se já existe
    if (document.getElementById('pwa-install-card')) {
        return;
    }

    const card = document.createElement('div');
    card.id = 'pwa-install-card';
    card.className = 'pwa-install-card';
    card.innerHTML = `
        <div class="pwa-install-content">
            <div class="pwa-install-icon">
                <img src="src/images/icon_logo_192x192.png" alt="Vanocode" width="48" height="48">
            </div>
            <div class="pwa-install-text">
                <h4>Instale a Vanocode</h4>
                <p>Tenha acesso rápido a todos os serviços diretamente na tela inicial do seu celular.</p>
            </div>
            <div class="pwa-install-actions">
                <button id="pwa-install-btn" class="pwa-install-btn">
                    <i class="fas fa-download"></i> Instalar
                </button>
                <button id="pwa-close-btn" class="pwa-close-btn">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(card);

    // Adicionar estilos
    const style = document.createElement('style');
    style.textContent = `
        .pwa-install-card {
            position: fixed;
            bottom: 20px;
            left: 20px;
            right: 20px;
            background: white;
            border-radius: 16px;
            box-shadow: 0 10px 60px rgba(0,0,0,0.2);
            padding: 16px;
            z-index: 10000;
            transform: translateY(120px);
            opacity: 0;
            transition: all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
            max-width: 400px;
            margin: 0 auto;
            border: 1px solid rgba(10, 102, 194, 0.1);
        }
        
        .pwa-install-card.show {
            transform: translateY(0);
            opacity: 1;
        }
        
        .pwa-install-content {
            display: flex;
            align-items: center;
            gap: 12px;
            flex-wrap: wrap;
        }
        
        .pwa-install-icon img {
            border-radius: 12px;
            width: 48px;
            height: 48px;
            object-fit: cover;
        }
        
        .pwa-install-text {
            flex: 1;
            min-width: 140px;
        }
        
        .pwa-install-text h4 {
            font-size: 0.95rem;
            font-weight: 700;
            color: #0A192F;
            margin-bottom: 2px;
        }
        
        .pwa-install-text p {
            font-size: 0.8rem;
            color: #666;
            margin: 0;
            line-height: 1.4;
        }
        
        .pwa-install-actions {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-left: auto;
        }
        
        .pwa-install-btn {
            background: var(--gradient-main, linear-gradient(135deg, #0A66C2, #4DB8FF));
            color: white;
            border: none;
            padding: 8px 18px;
            border-radius: 50px;
            font-weight: 600;
            font-size: 0.85rem;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        
        .pwa-install-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 15px rgba(10, 102, 194, 0.3);
        }
        
        .pwa-close-btn {
            background: transparent;
            border: none;
            color: #999;
            font-size: 1.2rem;
            cursor: pointer;
            padding: 4px 8px;
            transition: all 0.3s ease;
        }
        
        .pwa-close-btn:hover {
            color: #333;
            transform: scale(1.1);
        }
        
        /* Mobile improvements */
        @media (max-width: 480px) {
            .pwa-install-card {
                bottom: 10px;
                left: 10px;
                right: 10px;
                padding: 12px;
            }
            .pwa-install-text h4 {
                font-size: 0.85rem;
            }
            .pwa-install-text p {
                font-size: 0.75rem;
            }
            .pwa-install-btn {
                padding: 6px 14px;
                font-size: 0.75rem;
            }
        }
    `;
    document.head.appendChild(style);

    // Adicionar eventos
    installButton = document.getElementById('pwa-install-btn');
    const closeButton = document.getElementById('pwa-close-btn');
    
    installButton.addEventListener('click', handleInstallClick);
    closeButton.addEventListener('click', function() {
        hideInstallCard();
        // Salvar no localStorage para não mostrar novamente por 7 dias
        localStorage.setItem('pwa-install-dismissed', Date.now());
    });
}

// Mostrar card de instalação
function showInstallCard() {
    const card = document.getElementById('pwa-install-card');
    if (card) {
        card.classList.add('show');
    }
}

// Esconder card de instalação
function hideInstallCard() {
    const card = document.getElementById('pwa-install-card');
    if (card) {
        card.classList.remove('show');
    }
}

// Lidar com clique no botão instalar
function handleInstallClick() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('✅ Usuário aceitou instalar o PWA');
                hideInstallCard();
                isInstalled = true;
                // Enviar notificação de boas-vindas
                setTimeout(() => {
                    showWelcomeNotification();
                }, 3000);
            } else {
                console.log('❌ Usuário recusou instalar o PWA');
            }
            deferredPrompt = null;
        });
    }
}

// Mostrar notificação de boas-vindas
function showWelcomeNotification() {
    if ('Notification' in window && Notification.permission === 'granted') {
        const notification = new Notification('Bem-vindo à Vanocode! 🚀', {
            body: 'Obrigado por instalar nosso app. Explore todos os serviços e soluções digitais.',
            icon: 'src/images/icon_logo_192x192.png',
            badge: 'src/images/icon_logo_192x192.png',
            tag: 'welcome-vanocode',
            requireInteraction: true,
            silent: false
        });
        
        notification.onclick = function() {
            window.focus();
            this.close();
        };
    }
}

// Inicializar o PWA Install
function initPWAInstall() {
    // Verificar se já está instalado
    if (checkIfInstalled()) {
        console.log('✅ PWA já está instalado');
        return;
    }

    // Verificar se o usuário já descartou o card recentemente
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
        const daysSinceDismiss = (Date.now() - parseInt(dismissed)) / (1000 * 60 * 60 * 24);
        if (daysSinceDismiss < 7) {
            console.log('⏳ Card de instalação descartado recentemente');
            return;
        }
    }

    // Solicitar permissão para notificações
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                console.log('✅ Permissão para notificações concedida');
            }
        });
    }

    // Criar o card
    createInstallCard();

    // Mostrar após 3 segundos (mais profissional)
    setTimeout(() => {
        showInstallCard();
    }, 3000);
}

// Evento beforeinstallprompt
window.addEventListener('beforeinstallprompt', function(e) {
    e.preventDefault();
    deferredPrompt = e;
    console.log('📲 Evento beforeinstallprompt capturado');
    initPWAInstall();
});

// Evento appinstalled
window.addEventListener('appinstalled', function() {
    console.log('✅ PWA instalado com sucesso!');
    isInstalled = true;
    hideInstallCard();
    // Enviar notificação de boas-vindas
    setTimeout(() => {
        showWelcomeNotification();
    }, 2000);
});

// Verificar se o PWA foi instalado em dispositivos iOS (Safari)
if (window.navigator.standalone === true) {
    console.log('✅ PWA instalado no iOS');
    isInstalled = true;
}

// Inicializar o PWA Install também no carregamento da página
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se não está instalado
    if (!checkIfInstalled()) {
        // Se o beforeinstallprompt não foi capturado, mostrar o card após 5 segundos
        setTimeout(() => {
            if (!deferredPrompt && !isInstalled) {
                // Mostrar card com instruções para desktop/mobile
                console.log('📱 Tentando mostrar card de instalação (fallback)');
                // Só mostrar em dispositivos móveis
                if (window.innerWidth <= 768) {
                    initPWAInstall();
                }
            }
        }, 5000);
    }
});

// Detectar mudanças no modo standalone (quando o usuário instala enquanto navega)
window.addEventListener('display-mode-change', function(e) {
    if (e.matches || window.navigator.standalone) {
        console.log('✅ Aplicação mudou para modo standalone');
        isInstalled = true;
        hideInstallCard();
    }
});

// Expo para uso global
window.pwaInstall = {
    init: initPWAInstall,
    showCard: showInstallCard,
    hideCard: hideInstallCard,
    isInstalled: checkIfInstalled
};