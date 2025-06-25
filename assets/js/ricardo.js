// Dark/Light Mode Toggle
const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
const currentTheme = localStorage.getItem('theme');

if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    if (currentTheme === 'dark') {
        toggleSwitch.checked = true;
    }
}

function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }
}

toggleSwitch.addEventListener('change', switchTheme, false);

// Contador de estatísticas
const counters = document.querySelectorAll('.stats-number');
const speed = 200;

function animateCounters() {
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-count');
        const count = +counter.innerText;
        const increment = target / speed;
        
        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(animateCounters, 1);
        } else {
            counter.innerText = target;
        }
    });
}

// Inicia a animação quando a seção estiver visível
const statsSection = document.querySelector('.gov-stats');
const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
        animateCounters();
    }
});

observer.observe(statsSection);

// Gráficos
document.addEventListener('DOMContentLoaded', function() {
    // Gráfico de distribuição por bairros
    const bairrosCtx = document.getElementById('bairrosChart').getContext('2d');
    const bairrosChart = new Chart(bairrosCtx, {
        type: 'doughnut',
        data: {
            labels: ['Camama 1', 'Camama 2', 'Camama 3', 'Zango 0', 'Zango 1', 'Zango 2'],
            datasets: [{
                data: [25, 20, 18, 12, 15, 10],
                backgroundColor: [
                    '#CC092F',
                    '#FFCB00',
                    '#000000',
                    '#CC092F',
                    '#FFCB00',
                    '#000000'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                position: 'bottom'
            }
        }
    });
    
    // Gráfico de crescimento populacional
    const populacaoCtx = document.getElementById('populacaoChart').getContext('2d');
    const populacaoChart = new Chart(populacaoCtx, {
        type: 'line',
        data: {
            labels: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022'],
            datasets: [{
                label: 'População',
                data: [320000, 350000, 380000, 410000, 440000, 470000, 490000, 500000],
                backgroundColor: 'rgba(204, 9, 47, 0.1)',
                borderColor: '#CC092F',
                borderWidth: 2,
                pointBackgroundColor: '#CC092F',
                pointRadius: 4,
                pointHoverRadius: 6,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: false
                    }
                }]
            }
        }
    });
});

// Validação do formulário de contato
const contactForm = document.getElementById('govContactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validação simples
        const nome = document.getElementById('nome');
        const email = document.getElementById('email');
        const assunto = document.getElementById('assunto');
        const mensagem = document.getElementById('mensagem');
        const termos = document.getElementById('termos');
        
        let isValid = true;
        
        if (nome.value.trim() === '') {
            nome.classList.add('is-invalid');
            isValid = false;
        } else {
            nome.classList.remove('is-invalid');
        }
        
        if (email.value.trim() === '' || !email.value.includes('@')) {
            email.classList.add('is-invalid');
            isValid = false;
        } else {
            email.classList.remove('is-invalid');
        }
        
        if (assunto.value === '') {
            assunto.classList.add('is-invalid');
            isValid = false;
        } else {
            assunto.classList.remove('is-invalid');
        }
        
        if (mensagem.value.trim() === '') {
            mensagem.classList.add('is-invalid');
            isValid = false;
        } else {
            mensagem.classList.remove('is-invalid');
        }
        
        if (!termos.checked) {
            termos.classList.add('is-invalid');
            isValid = false;
        } else {
            termos.classList.remove('is-invalid');
        }
        
        if (isValid) {
            // Simular envio
            alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
            contactForm.reset();
        }
    });
}

// Scroll suave para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Botão para voltar ao topo
window.addEventListener('scroll', function() {
    const scrollTop = document.getElementById('scroll-Top');
    if (window.pageYOffset > 300) {
        scrollTop.style.display = 'block';
    } else {
        scrollTop.style.display = 'none';
    }
});