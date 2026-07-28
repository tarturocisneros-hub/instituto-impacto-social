// ===== SUPABASE CONFIG =====
const SUPABASE_URL = 'https://tvyxrjustjiiitvvafdi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2eXhyanVzdGppaWl0dnZhZmRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyNDQ1MzgsImV4cCI6MjEwMDgyMDUzOH0.mH4Nz14ZzVbZP8Vk3LFtgqt4q1ilMg3--WBn7R9LHfo';

let supabaseClient = null;
try {
    if (window.supabase && window.supabase.createClient) {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
} catch (e) {
    console.warn('Supabase no disponible, los datos no se guardarán:', e);
}

// ===== QUIZ DATA =====
const questions = [
    {
        id: 1,
        title: "El ADN de tu producto o servicio",
        category: "🌱 Producto con Propósito",
        question: "¿Qué problema resuelve tu producto o servicio más allá de vender?",
        options: [
            { text: "Directamente atacamos o resolvemos una problemática social o ambiental de la región con lo que vendemos.", points: 3 },
            { text: "Es un producto o servicio de consumo general, pero intentamos que sea una alternativa de muy buena calidad y justa para la zona.", points: 2 },
            { text: "Vendemos lo que el mercado pide y es rentable; el impacto social no es el enfoque principal de nuestro producto.", points: 1 }
        ]
    },
    {
        id: 2,
        title: "Ingredientes, materiales y ciclo de vida",
        category: "♻️ Medio Ambiente",
        question: "¿Cómo son los materiales o insumos principales de lo que comercializas?",
        options: [
            { text: "Nuestros insumos son amigables con el medio ambiente, biodegradables, de comercio justo o diseñados para durar y reutilizarse.", points: 3 },
            { text: "Usamos materiales estándar de la industria; tratamos de no desperdiciar, pero dependemos del mercado tradicional.", points: 2 },
            { text: "Usamos materiales desechables o de un solo uso porque es lo más práctico para mantener costos bajos.", points: 1 }
        ]
    },
    {
        id: 3,
        title: "Origen del talento humano",
        category: "👥 Comunidad",
        question: "Cuando contratas a alguien nuevo para tu equipo, ¿dónde buscas primero?",
        options: [
            { text: "Publico en mis redes personales, grupos de WhatsApp locales o busco talento directo de la zona para impulsar a la comunidad.", points: 3 },
            { text: "Uso plataformas generales de empleo (OCC, LinkedIn, etc.) sin importar mucho de dónde sean.", points: 2 },
            { text: "Contrato principalmente a conocidos o familiares cercanos por confianza rápida.", points: 1 }
        ]
    },
    {
        id: 4,
        title: "Inclusión y oportunidad laboral",
        category: "💼 Equipo & Familia",
        question: "Al contratar o abrir espacios en tu equipo, ¿tienes algún enfoque particular de apoyo?",
        options: [
            { text: "Damos oportunidad de manera activa a jóvenes sin experiencia previa, estudiantes, adultos mayores o madres jefas de familia para impulsarlos.", points: 3 },
            { text: "Contratamos a quien cumpla con el perfil técnico necesario para el puesto, sin fijarnos en condiciones específicas.", points: 2 },
            { text: "Buscamos perfiles muy específicos o con mucha experiencia previa para evitar curvas de aprendizaje largas.", points: 1 }
        ]
    },
    {
        id: 5,
        title: "Cadena de suministro y proveeduría",
        category: "🏘️ Liderazgo Local",
        question: "A la hora de comprar café, papelería, insumos o servicios para tu operación diaria, ¿qué haces?",
        options: [
            { text: "Busco primero al negocio, tiendita o proveedor de la cuadra o de la ciudad para hacer crecer el consumo local.", points: 3 },
            { text: "Compro donde sea más barato o me quede más práctico, ya sea tienda local o gran cadena.", points: 2 },
            { text: "Pido casi todo en línea a grandes plataformas nacionales o internacionales por comodidad.", points: 1 }
        ]
    },
    {
        id: 6,
        title: "Cuidado ambiental cotidiano",
        category: "♻️ Medio Ambiente",
        question: "¿Cómo cuidan los detalles cotidianos de recursos y residuos en su operación?",
        options: [
            { text: "Tenemos reglas sencillas y claras: evitamos plásticos de un solo uso, reciclamos, separamos basura o cuidamos los recursos básicos.", points: 3 },
            { text: "Hacemos lo que se puede en el día a día, si nos acordamos apagamos luces o reciclamos algunas cosas.", points: 2 },
            { text: "La verdad no le ponemos mucha atención a eso, el ritmo del día no nos da para pensar en la basura o la energía.", points: 1 }
        ]
    },
    {
        id: 7,
        title: "Economía circular y manejo de mermas",
        category: "♻️ Medio Ambiente",
        question: "Respecto a los residuos, sobrantes o mermas que genera tu producto o servicio diario:",
        options: [
            { text: "Reutilizamos, donamos o transformamos nuestros sobrantes o mermas para darles una segunda vida (cero desperdicio).", points: 3 },
            { text: "Intentamos no desperdiciar tanto, pero lo que ya no sirve se va a la basura convencional.", points: 2 },
            { text: "Generamos los residuos normales de operación y no hay un proceso para aprovecharlos.", points: 1 }
        ]
    },
    {
        id: 8,
        title: "Bienestar y tiempo para las familias",
        category: "💼 Equipo & Familia",
        question: "¿Cómo manejas el bienestar y el tiempo familiar de tu equipo?",
        options: [
            { text: "Cuidamos los horarios para que todos tengan tiempo libre real, y organizamos pequeños detalles para integrarlos (talleres, una carnita asada, un día de campo o convivir con sus familias).", points: 3 },
            { text: "Respetamos el horario laboral de ley y los dejamos salir a tiempo, pero cada quien por su lado fuera del trabajo.", points: 2 },
            { text: "El ritmo a veces es pesado, se trabaja horas extra si es necesario y casi no hay espacio para la vida familiar.", points: 1 }
        ]
    },
    {
        id: 9,
        title: "Acción comunitaria y voluntariado",
        category: "👥 Comunidad",
        question: "¿Tu equipo realiza actividades de apoyo a la comunidad?",
        options: [
            { text: "Cada par de meses organizamos al equipo (y a sus familias si se suman) para aportar a la comunidad: una limpia de playa/parque, donar despensas a un asilo o apoyar una causa local.", points: 3 },
            { text: "A veces donamos algo o participamos si alguien más lo organiza, pero nosotros no lo promovemos activamente.", points: 2 },
            { text: "Estamos 100% enfocados en el negocio; no destinamos tiempo ni recursos a ese tipo de actividades comunitarias.", points: 1 }
        ]
    },
    {
        id: 10,
        title: "Liderazgo de barrio y entorno",
        category: "🏘️ Liderazgo Local",
        question: "Tu rol como líder frente a lo que pasa en tu cuadra, calle o zona:",
        options: [
            { text: "Actúo como líder vecinal: reporto luminarias fundidas o baches, me organizo con otros negocios ante temas de seguridad, y fomento que mi equipo participe cívicamente.", points: 3 },
            { text: "Si veo un problema en la calle a veces aviso o reporto, pero prefiero mantenerme al margen y enfocarme solo en mi local.", points: 2 },
            { text: "No me meto en temas de la calle o la colonia; cada quien que resuelva lo suyo.", points: 1 }
        ]
    },
    {
        id: 11,
        title: "Vinculación y respuesta a causas locales",
        category: "🏘️ Liderazgo Local",
        question: "Ante peticiones de apoyo, patrocinios o causas locales (escuelas, vecinos, etc.):",
        options: [
            { text: "Siempre buscamos la forma de sumarnos, ya sea con producto, un descuento o difusión para causas de la zona.", points: 3 },
            { text: "Solo apoyamos si de paso nos sirve como mención o publicidad directa para la marca.", points: 2 },
            { text: "Decimos que no a ese tipo de solicitudes; no nos compete.", points: 1 }
        ]
    }
];

// ===== RESULTS PROFILES =====
const profiles = [
    {
        name: "El Superviviente",
        emoji: "😅",
        image: "El Superviviente.png",
        personaje: "Michael Scott",
        minScore: 11,
        maxScore: 15,
        diagnosis: "Estás 100% concentrado en sobrevivir, vender y sacar la nómina mes a mes. Es totalmente comprensible al empezar, pero tu negocio opera en modo \"islas\": compras lo más barato, produces sin mirar el entorno y la familia o el equipo cargan con todo el peso.",
        challenge: "No necesitas cambiar tu modelo de negocio de la noche a la mañana. Comienza por algo sencillo: la próxima vez que necesites un insumo, busca al proveedor de la cuadra de al lado.",
        note: "Recuerda que estos pequeños cambios no te hacen perder tu objetivo de rentabilidad ni descuidan tu productividad; al contrario, un negocio más cercano y ordenado siempre se vuelve más sólido."
    },
    {
        name: "El Negocio con Buena Vibra",
        emoji: "😊",
        image: "El Negocio con Buena Vibra.png",
        personaje: "Bob Esponja",
        minScore: 16,
        maxScore: 21,
        diagnosis: "Eres un buen jefe, respetas los horarios de tu equipo, intentas portarte bien con el planeta cuando te acuerdas y tratas de ser un ciudadano tranquilo. Tienes buena intención, pero tu producto y tus procesos siguen siendo los tradicionales de toda la vida.",
        challenge: "El ADN del Producto: Tu operación ya es amable, pero ahora pregúntate: ¿cómo puede lo que vendes resolver un problema real de tu comunidad o dejar de generar basura?",
        note: "Invertir en tu entorno y en tu gente no está peleado con vender más; fomentar buenos hábitos y valores fortalece tu marca y la hace profundamente rentable."
    },
    {
        name: "El Agente de Barrio",
        emoji: "💪",
        image: "El Agente de Barrio.png",
        personaje: "Peter Parker",
        minScore: 22,
        maxScore: 26,
        diagnosis: "Ya entendiste que un negocio local no vive aislado. Te preocupas por tu gente, organizas la carnita asada o un convivio con las familias, y si hay un bache o una luminaria fundida en la calle, tú eres el primero en levantar la voz o reportarlo.",
        challenge: "Tienes el corazón de líder vecinal y el cuidado humano bien dominados. El siguiente salto es conectar tu producto o servicio directamente con una causa o un proceso mucho más ecológico.",
        note: "Cuidar a la familia de tu equipo y mejorar tu comunidad genera un ambiente de lealtad que impulsa de forma directa la productividad y el éxito de tu empresa."
    },
    {
        name: "La Empresa con Propósito",
        emoji: "🌟",
        image: "La Empresa con Propósito.png",
        personaje: "Ted Lasso",
        minScore: 27,
        maxScore: 30,
        diagnosis: "¡Lo estás logrando! Tu producto o servicio ya atiende una necesidad real de la región, tus compras son locales, cuidas el tiempo y la vida familiar de tu equipo, y asumes tu rol de liderazgo en la zona donde te instalaste.",
        challenge: "Inspirar a otros. Tu negocio ya camina con una visión de impacto; ahora tu misión es contagiar a otros empresarios jóvenes de tu cuadra o de tu cámara para que se sumen a esta forma de hacer economía.",
        note: "Has comprobado que el enfoque social y la rentabilidad van de la mano. Un negocio con valores claros es un negocio altamente competitivo y listo para crecer."
    },
    {
        name: "El Disruptor Local",
        emoji: "🦸",
        image: "El Disruptor Local.png",
        personaje: "Tony Stark",
        minScore: 31,
        maxScore: 33,
        diagnosis: "Eres un agente de cambio total. Tu modelo de negocio nació para resolver un problema social o ambiental de raíz, tu cadena de suministro es 100% regional, las familias de tus colaboradores son parte activa de la comunidad de la empresa, y eres un referente de liderazgo cívico en tu municipio.",
        challenge: "Escalar el impacto sin perder la esencia humana y territorial que te trajo hasta aquí. Eres el ejemplo vivo de lo que este ranking busca documentar.",
        note: "Eres la prueba viviente de que el éxito financiero y la responsabilidad social se potencian mutuamente. Tu productividad es el reflejo de una comunidad y un equipo que crecen contigo."
    }
];

// ===== GAME STATE =====
let currentQuestion = 0;
let score = 0;
let answers = [];
let userData = {
    tipoNegocio: '',
    estado: '',
    ciudad: ''
};

// ===== INIT =====
function init() {
    createParticles();
    populateRegisterForm();
}

// ===== POPULATE REGISTER FORM =====
function populateRegisterForm() {
    // Populate business types
    const tipoSelect = document.getElementById('tipo-negocio');
    tiposNegocio.forEach(tipo => {
        const opt = document.createElement('option');
        opt.value = tipo;
        opt.textContent = tipo;
        tipoSelect.appendChild(opt);
    });

    // Populate states
    const estadoSelect = document.getElementById('estado');
    Object.keys(estadosCiudades).sort().forEach(estado => {
        const opt = document.createElement('option');
        opt.value = estado;
        opt.textContent = estado;
        estadoSelect.appendChild(opt);
    });
}

// ===== LOAD CITIES =====
function loadCities() {
    const estado = document.getElementById('estado').value;
    const ciudadSelect = document.getElementById('ciudad');
    
    ciudadSelect.innerHTML = '<option value="">Selecciona tu ciudad...</option>';
    
    if (estado && estadosCiudades[estado]) {
        ciudadSelect.disabled = false;
        estadosCiudades[estado].forEach(ciudad => {
            const opt = document.createElement('option');
            opt.value = ciudad;
            opt.textContent = ciudad;
            ciudadSelect.appendChild(opt);
        });
    } else {
        ciudadSelect.disabled = true;
    }
}

// ===== CHECK FORM COMPLETE =====
function checkFormComplete() {
    const tipo = document.getElementById('tipo-negocio').value;
    const estado = document.getElementById('estado').value;
    const ciudad = document.getElementById('ciudad').value;
    const btn = document.getElementById('btn-continue');
    
    if (tipo && estado && ciudad) {
        btn.disabled = false;
    } else {
        btn.disabled = true;
    }
}

// ===== SHOW REGISTER =====
function showRegister() {
    showScreen('register-screen');
}

// ===== START QUIZ FROM REGISTER =====
function startQuizFromRegister() {
    userData.tipoNegocio = document.getElementById('tipo-negocio').value;
    userData.estado = document.getElementById('estado').value;
    userData.ciudad = document.getElementById('ciudad').value;
    
    startQuiz();
}

// ===== INIT PARTICLES =====
function createParticles() {
    const container = document.getElementById('particles');
    const colors = ['#6c63ff', '#00d4aa', '#ffd700', '#ff6b6b', '#ffffff'];
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 6 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
        particle.style.animationDelay = (Math.random() * 10) + 's';
        container.appendChild(particle);
    }
}

// ===== SCREEN TRANSITIONS =====
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const screen = document.getElementById(screenId);
    screen.classList.add('active');
}

// ===== START QUIZ =====
function startQuiz() {
    currentQuestion = 0;
    score = 0;
    answers = [];
    showScreen('quiz-screen');
    renderQuestion();
}

// ===== RENDER QUESTION =====
function renderQuestion() {
    const q = questions[currentQuestion];
    const container = document.getElementById('question-container');
    
    // Update progress
    const progress = ((currentQuestion) / questions.length) * 100;
    document.getElementById('progress-bar').style.width = progress + '%';
    document.getElementById('progress-text').textContent = `${currentQuestion + 1}/${questions.length}`;
    
    // Update category badge
    document.getElementById('category-badge').textContent = q.category;
    
    // Update question
    document.getElementById('question-number').textContent = `Pregunta ${q.id}: ${q.title}`;
    document.getElementById('question-text').textContent = q.question;
    
    // Render options
    const optionsGrid = document.getElementById('options-grid');
    const letters = ['A', 'B', 'C'];
    
    optionsGrid.innerHTML = q.options.map((opt, i) => `
        <button class="option-btn" onclick="selectAnswer(${i}, ${opt.points})">
            <span class="option-letter">${letters[i]}</span>
            <span class="option-text">${opt.text}</span>
        </button>
    `).join('');
    
    // Animate in
    container.classList.remove('question-enter', 'question-exit');
    void container.offsetWidth;
    container.classList.add('question-enter');
}

// ===== SELECT ANSWER =====
function selectAnswer(index, points) {
    // Disable all options
    const options = document.querySelectorAll('.option-btn');
    options.forEach(btn => btn.style.pointerEvents = 'none');
    
    // Highlight selected with neutral color
    options[index].classList.add('selected');
    
    // Update score silently
    score += points;
    answers.push({ question: currentQuestion + 1, points });
    
    // Next question after delay
    setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
            const container = document.getElementById('question-container');
            container.classList.add('question-exit');
            
            setTimeout(() => {
                currentQuestion++;
                renderQuestion();
            }, 400);
        } else {
            showResults();
        }
    }, 600);
}

// ===== SHOW RESULTS =====
function showResults() {
    showScreen('results-screen');
    
    // Find matching profile
    const profile = profiles.find(p => score >= p.minScore && score <= p.maxScore) || profiles[0];
    
    // Set result content
    document.getElementById('result-title').textContent = profile.name;
    
    // Set profile image with character title
    const imgContainer = document.getElementById('result-image');
    imgContainer.innerHTML = `
        <p class="character-title">Eres un empresario al puro estilo de <strong>${profile.personaje}</strong></p>
        <img src="${profile.image}" alt="${profile.name}" class="profile-image" />
    `;
    
    // Animate score ring
    setTimeout(() => {
        const ring = document.getElementById('score-ring');
        const circumference = 2 * Math.PI * 52;
        const percentage = score / 33;
        const offset = circumference * (1 - percentage);
        ring.style.strokeDasharray = circumference;
        ring.style.strokeDashoffset = offset;
    }, 300);
    
    // Set diagnosis
    document.getElementById('result-diagnosis').innerHTML = `
        <h3>📋 El Diagnóstico</h3>
        <p>${profile.diagnosis}</p>
    `;
    
    document.getElementById('result-challenge').innerHTML = `
        <h3>🎯 Tu Reto de Impacto</h3>
        <p>${profile.challenge}</p>
    `;
    
    document.getElementById('result-note').innerHTML = `
        <h3>💡 Nota Clave</h3>
        <p>${profile.note}</p>
    `;
    
    // Confetti!
    launchConfetti();
    
    // Save to Supabase
    saveToSupabase(profile);
}

// ===== SAVE TO SUPABASE =====
async function saveToSupabase(profile) {
    if (!supabaseClient) {
        console.warn('Supabase no conectado, datos no guardados');
        return;
    }
    try {
        const { error } = await supabaseClient
            .from('quiz_responses')
            .insert({
                tipo_negocio: userData.tipoNegocio,
                estado: userData.estado,
                ciudad: userData.ciudad,
                puntaje_total: score,
                nivel: profile.name,
                respuestas: answers
            });
        
        if (error) {
            console.error('Error guardando en Supabase:', error);
        } else {
            console.log('✅ Respuesta guardada exitosamente');
        }
    } catch (err) {
        console.error('Error de conexión con Supabase:', err);
    }
}

// ===== CONFETTI =====
function launchConfetti() {
    const container = document.getElementById('confetti-container');
    container.innerHTML = '';
    const colors = ['#6c63ff', '#00d4aa', '#ffd700', '#ff6b6b', '#ff9ff3', '#54a0ff'];
    
    for (let i = 0; i < 50; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = Math.random() * 100 + '%';
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.animationDelay = Math.random() * 2 + 's';
        piece.style.animationDuration = (Math.random() * 2 + 2) + 's';
        piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        piece.style.width = (Math.random() * 8 + 5) + 'px';
        piece.style.height = (Math.random() * 8 + 5) + 'px';
        container.appendChild(piece);
    }
}

// ===== RESTART =====
function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    answers = [];
    showScreen('start-screen');
}

// ===== SHARE =====
async function shareResults() {
    const profile = profiles.find(p => score >= p.minScore && score <= p.maxScore) || profiles[0];
    const text = `🌍 Mi resultado en el Índice de Impacto Social:\n\n${profile.emoji} Nivel: ${profile.name}\n✨ Soy un empresario al estilo de ${profile.personaje}\n\n¿Qué tan empresario social eres tú? ¡Haz el quiz!\n${window.location.href}`;
    
    const btn = document.querySelector('.btn-share');
    const originalBtn = btn.innerHTML;
    btn.innerHTML = '<span>📸 Capturando...</span>';
    btn.disabled = true;

    try {
        // Take screenshot of results card
        const card = document.querySelector('.results-card');
        const canvas = await html2canvas(card, {
            backgroundColor: '#1a1a2e',
            scale: 2,
            useCORS: true,
            logging: false
        });
        
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
        const file = new File([blob], `mi-resultado-impacto-social.png`, { type: 'image/png' });

        if (navigator.share && navigator.canShare) {
            const shareData = { files: [file], title: 'Mi Índice de Impacto Social', text: text };
            if (navigator.canShare(shareData)) {
                await navigator.share(shareData);
            } else {
                // Share without file
                await navigator.share({ title: 'Mi Índice de Impacto Social', text: text, url: window.location.href });
            }
        } else {
            // Desktop fallback: download image + copy text
            const link = document.createElement('a');
            link.download = 'mi-resultado-impacto-social.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
            await navigator.clipboard.writeText(text);
            btn.innerHTML = '<span>✅ Imagen descargada y texto copiado</span>';
            setTimeout(() => { btn.innerHTML = originalBtn; btn.disabled = false; }, 3000);
            return;
        }
    } catch (err) {
        console.error('Error al compartir:', err);
        // Fallback: just copy text
        try {
            await navigator.clipboard.writeText(text);
            btn.innerHTML = '<span>✅ ¡Texto copiado al portapapeles!</span>';
            setTimeout(() => { btn.innerHTML = originalBtn; btn.disabled = false; }, 2500);
            return;
        } catch (e) {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        }
    }
    
    btn.innerHTML = originalBtn;
    btn.disabled = false;
}

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
    if (document.getElementById('quiz-screen').classList.contains('active')) {
        const options = document.querySelectorAll('.option-btn');
        if (options.length > 0 && options[0].style.pointerEvents !== 'none') {
            if (e.key === '1' || e.key === 'a' || e.key === 'A') options[0].click();
            if (e.key === '2' || e.key === 'b' || e.key === 'B') options[1].click();
            if (e.key === '3' || e.key === 'c' || e.key === 'C') options[2].click();
        }
    }
    if (e.key === 'Enter' && document.getElementById('start-screen').classList.contains('active')) {
        showRegister();
    }
});

// ===== INIT =====
init();
