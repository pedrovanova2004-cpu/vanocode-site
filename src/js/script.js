// 1. PRELOADER PROFISSIONAL
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    
    // Aguarda o carregamento completo da página + 1.5s para animação
    setTimeout(() => {
        preloader.classList.add('hidden');
    }, 2000);
});

// 2. MENU MOBILE
function toggleMenu() {
    const menu = document.getElementById('navMenu');
    menu.classList.toggle('open');
}

function closeMenu() {
    const menu = document.getElementById('navMenu');
    menu.classList.remove('open');
}

// 3. SCROLL REVEAL (Animações ao rolar)
document.addEventListener('DOMContentLoaded', function() {
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
});

// 4. COMPARTILHAR CONTACTOS
function compartilharContactos() {
    const texto = `📇 Contacto Vanocode - Pedro Vanova

🏢 Empresa: Vanocode - Soluções Digitais
📞 Telefone: +244 976 510 057
📧 Email: pedro@vanocode.com
📸 Instagram: instagram.com/pedrovanova
💻 GitHub: github.com/pedrovanova
📦 Catálogo: wa.me/c/244976510057

💡 Descrição: Plataforma de soluções digitais (Web, Apps, Marketing, Automação).`;

    if (navigator.share) {
        navigator.share({
            title: 'Contacto Vanocode',
            text: texto,
        }).catch(() => {
            fallbackCopy(texto);
        });
    } else {
        fallbackCopy(texto);
    }
}

function fallbackCopy(texto) {
    const textArea = document.createElement("textarea");
    textArea.value = texto;
    document.body.appendChild(textArea);
    textArea.select();
    try {
        document.execCommand('copy');
        alert('✅ Contactos copiados para a área de transferência! Pode colar onde quiser.');
    } catch (err) {
        alert('Não foi possível copiar automaticamente. Eis os contactos:\n\n' + texto);
    }
    document.body.removeChild(textArea);
}