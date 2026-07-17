'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const MARKS = [0.0, 4.4, 8.8, 13.2, 17.6, 22.0, 26.4, 30.8]; // 8 escenas
const CIERRE = 35.2; // cartón final
const CAPTIONS = [
    "Tu familia, en buenas manos",
    "Diagnóstico asistido por inteligencia artificial",
    "Radiografía panorámica en tu primera visita",
    "Gabinetes de última generación",
    "Atención también a distancia",
    "Seguimiento desde tu móvil",
    "Tus datos no salen de la clínica",
    "Un cerebro común que responde a todos",
];

const SLIDES = [
    {
        eyebrow: "Análisis asistido",
        title: "Inteligencia artificial que afina cada diagnóstico",
        description: "Nuestros doctores se apoyan en herramientas de IA para analizar radiografías, detectar detalles que escapan al ojo y planificar cada tratamiento con precisión milimétrica.",
        image: "images/technology/tecnologia-inteligencia-artificial.png",
        chips: ["Análisis de imágenes", "Planificación digital", "Apoyo al profesional"]
    },
    {
        eyebrow: "Radiología y diagnóstico",
        title: "Radiografía panorámica en tu primera cita gratis",
        description: "Sin desplazamientos ni esperas: pruebas de imagen en la propia clínica. Sales con diagnóstico completo, plan de tratamiento y presupuesto cerrado por escrito.",
        image: "images/technology/tecnologia-radiografia-panoramica.png",
        chips: ["Diagnóstico en clínica", "Primera cita completa", "Alta definición"]
    },
    {
        eyebrow: "Instalaciones y confort",
        title: "Gabinetes para que respires tranquilo",
        description: "Dos gabinetes con sillones ultramodernos, luz natural y acceso adaptado. Porque ir al dentista también puede ser una experiencia cómoda.",
        image: "images/technology/tecnologia-sillon-dental.png",
        chips: ["Sillones ergonómicos", "Equipamiento premium", "Espacios luminosos"]
    },
    {
        eyebrow: "Atención remota",
        title: "Tu dentista, también desde el sofá de casa",
        description: "Videoconsulta, seguimiento remoto y agente telefónico automatizado con IA para recordarte tus citas y revisar tu evolución sin moverte de casa.",
        image: "images/technology/tecnologia-cita-virtual.png",
        chips: ["Videoconsulta", "Seguimiento remoto", "Agente telefónico IA"]
    },
    {
        eyebrow: "Telediagnóstico",
        title: "Una foto con tu móvil, una primera orientación",
        description: "Envíanos fotografías por WhatsApp o Telegram y recibe una primera valoración del equipo. Adjunta imágenes a tu cita y llega a consulta con medio camino andado.",
        image: "images/technology/tecnologia-camara-movil.png",
        chips: ["Envío por WhatsApp", "Primera orientación", "Seguimiento continuo"]
    },
    {
        eyebrow: "Soberanía y Retención",
        title: "Tus datos clínicos no salen de la clínica",
        description: "Tratamos datos médicos de categoría especial (Art. 9 RGPD) bajo soberanía local. Los datos se retienen únicamente durante la relación clínica más 5 años (Art. 32 LOPDGDD) antes de ser borrados o anonimizados. Las grabaciones del agente telefónico de voz se destruyen a los 90 días.",
        image: "images/technology/tecnologia-inteligencia-artificial.png",
        chips: ["Art. 9 RGPD · Datos Clínicos", "Retención LOPDGDD 5 años", "Borrado voz 90 días", "Soberanía local"]
    },
    {
        eyebrow: "IA y Anonimización",
        title: "Pipeline de seguridad con Microsoft Presidio",
        description: "Toda consulta a modelos de lenguaje externos pasa por nuestra pasarela local de anonimización basada en Microsoft Presidio (detectores de NIF, NIE, nombres). Garantizamos k-anonymity >= 5 y registramos cada consentimiento explícito en logs inmutables.",
        image: "images/technology/tecnologia-inteligencia-artificial.png",
        chips: ["MS Presidio pipeline", "k-anonymity >= 5", "Historial de consents", "Sin fuga de datos"]
    }
];

export default function Home() {
    // Navigation states
    const [navOpen, setNavOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navRef = useRef<HTMLElement>(null);

    // Video states
    const videoRef = useRef<HTMLVideoElement>(null);
    const [currentScene, setCurrentScene] = useState(0);
    const [showCaption, setShowCaption] = useState(true);
    const [videoPlaying, setVideoPlaying] = useState(true);
    const [progressPercent, setProgressPercent] = useState<number[]>(new Array(8).fill(0));

    // Carousel states
    const [activeSlide, setActiveSlide] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const touchStart = useRef<number | null>(null);

    // Assistant states
    const [assistantOpen, setAssistantOpen] = useState(false);

    // Audio states & refs
    const audioRef = useRef<HTMLAudioElement>(null);
    const [musicPlaying, setMusicPlaying] = useState(false);

    // Nav effect (sticky scroll shadow and height variable)
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 30);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });

        const updateNavH = () => {
            if (navRef.current) {
                document.documentElement.style.setProperty('--nav-h', `${navRef.current.offsetHeight}px`);
            }
        };
        updateNavH();
        window.addEventListener('resize', updateNavH);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', updateNavH);
        };
    }, []);

    // Force autoplay on component mount (resolves client-side navigation freeze)
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const attemptPlay = () => {
            video.muted = true;
            video.play()
                .then(() => {
                    setVideoPlaying(true);
                })
                .catch((e) => {
                    console.warn("Autoplay programmatic attempt blocked:", e);
                });
        };

        // Try playing immediately
        attemptPlay();

        // Register event-driven fallbacks to catch lazy-loading sources
        video.addEventListener('loadedmetadata', attemptPlay);
        video.addEventListener('canplay', attemptPlay);

        return () => {
            video.removeEventListener('loadedmetadata', attemptPlay);
            video.removeEventListener('canplay', attemptPlay);
        };
    }, []);

    // Video Sync logic
    const handleTimeUpdate = () => {
        const video = videoRef.current;
        if (!video) return;
        const t = video.currentTime;

        let idx = 0;
        for (let i = MARKS.length - 1; i >= 0; i--) {
            if (t >= MARKS[i]) {
                idx = i;
                break;
            }
        }
        if (t >= CIERRE) {
            idx = MARKS.length - 1;
        }

        if (idx !== currentScene) {
            setShowCaption(false);
            // Wait for layout/style fade out, then update slide details
            setTimeout(() => {
                setCurrentScene(idx);
                setShowCaption(true);
            }, 260);
        }

        // Calculate progress bars percentages
        const nextVal = idx < MARKS.length - 1 ? MARKS[idx + 1] : CIERRE;
        const pct = Math.max(0, Math.min(1, (t - MARKS[idx]) / (nextVal - MARKS[idx])));

        setProgressPercent(() => {
            const nextPct = new Array(8).fill(0);
            for (let k = 0; k < MARKS.length; k++) {
                if (k < idx) nextPct[k] = 100;
                else if (k > idx) nextPct[k] = 0;
                else nextPct[k] = pct * 100;
            }
            return nextPct;
        });
    };

    const handleSceneClick = (e: React.MouseEvent, index: number) => {
        e.preventDefault();
        const video = videoRef.current;
        if (video && video.readyState >= 1) {
            video.currentTime = MARKS[index] + 0.1;
            video.play().catch(() => { });
            setVideoPlaying(true);
        }
    };

    const toggleVideo = () => {
        const video = videoRef.current;
        const audio = audioRef.current;
        if (video) {
            if (video.paused) {
                video.play().catch(() => { });
                setVideoPlaying(true);
                if (musicPlaying && audio) {
                    audio.play().catch(() => { });
                }
            } else {
                video.pause();
                setVideoPlaying(false);
                if (audio) {
                    audio.pause();
                }
            }
        }
    };

    const toggleMusic = () => {
        const audio = audioRef.current;
        if (audio) {
            if (audio.paused) {
                audio.play().catch(() => { });
                setMusicPlaying(true);
            } else {
                audio.pause();
                setMusicPlaying(false);
            }
        }
    };

    // Keyboard navigation & slide timer
    const goNextSlide = () => setActiveSlide((prev) => (prev + 1) % SLIDES.length);
    const goPrevSlide = () => setActiveSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
            if (e.key === 'ArrowRight') goNextSlide();
            if (e.key === 'ArrowLeft') goPrevSlide();
            if (e.key === 'Escape' && assistantOpen) setAssistantOpen(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [assistantOpen]);

    useEffect(() => {
        if (isHovered) return;
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduceMotion) return;

        const timer = setInterval(() => {
            goNextSlide();
        }, 6000);
        return () => clearInterval(timer);
    }, [isHovered]);

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStart.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStart.current === null) return;
        const dx = e.changedTouches[0].clientX - touchStart.current;
        if (Math.abs(dx) > 40) {
            if (dx < 0) goNextSlide();
            else goPrevSlide();
        }
        touchStart.current = null;
    };

    return (
        <>
            {/* ===================== NAV EDITORIAL (logo arriba, menú debajo) ===================== */}
            <nav ref={navRef} className={`nav ${scrolled ? 'scrolled' : ''}`} id="nav">
                <div className="nav-inner">
                    <button
                        className="nav-toggle"
                        id="navToggle"
                        aria-label="Abrir menú"
                        aria-expanded={navOpen}
                        aria-controls="navMenu"
                        onClick={() => setNavOpen(!navOpen)}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                    <a className="nav-brand" href="#hero">
                        <div className="txt">
                            <b>Clínica Río Piedras</b>
                            <small className="mobile-hide">Clínica Dental · Madrid · 1985</small>
                        </div>
                        <img src="images/logo-clinica.png" alt="Logotipo Clínica Dental Ríos Piedras" />
                    </a>
                    <div className={`nav-menu ${navOpen ? 'open' : ''}`} id="navMenu">
                        <div className="nav-links-inner">
                            <a href="#equipo" onClick={() => setNavOpen(false)}>Equipo</a>
                            <a href="#especialidades" onClick={() => setNavOpen(false)}>Especialidades</a>
                            <a href="#tecnologia" onClick={() => setNavOpen(false)}>Tecnología</a>
                            <a href="#canales" onClick={() => setNavOpen(false)}>Canales</a>
                            <a href="#portal" onClick={() => setNavOpen(false)}>Portal</a>
                        </div>
                        <a
                            href={process.env.NEXT_PUBLIC_APPMVCCLINICA || "https://clinicadentalriopiedras.n8njigretera.cloud"}
                            className="cta"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => {
                                setNavOpen(false);
                            }}
                            onDoubleClick={(e) => {
                                e.preventDefault();
                                window.open(process.env.NEXT_PUBLIC_APPMVCCLINICA || "https://clinicadentalriopiedras.n8njigretera.cloud", "_blank");
                            }}
                        >
                            Acceso Clientes
                        </a>
                    </div>
                </div>
            </nav>

            {/* ===================== HERO ===================== */}
            <section className="hero" id="hero">
                <div className="hero-inner">
                    <h1>Cuatro décadas cuidando la sonrisa, la estética y la salud bucodental de las familias de Madrid</h1>
                    <div className="hero-actions">
                        <a className="btn-solid" href="#contacto">Reserva tu primera visita gratis →</a>
                        <a className="btn-ghost" href="#especialidades">Ver especialidades</a>
                    </div>
                </div>

                {/* Vídeo cinematográfico contenido (no ocupa toda la pantalla) */}
                <div className="hero-media" aria-label="Vídeo de presentación de la clínica">
                    <video
                        ref={videoRef}
                        className="hero-video"
                        id="heroVideo"
                        src="/videos/hero-clinica.mp4"
                        poster="/videos/hero-poster.jpg"
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="auto"
                        onTimeUpdate={handleTimeUpdate}
                    />
                    <audio
                        ref={audioRef}
                        src="/sonidos_mp3/Erik Satie - Gymnopédie No.1.mp3"
                        loop
                        preload="auto"
                    />
                    <div className="hero-veil"></div>
                    <div style={{ position: 'absolute', bottom: '2rem', right: '2rem', display: 'flex', gap: '0.8rem', zIndex: 12 }}>
                        <button className="hero-toggle" id="heroToggle" aria-label={videoPlaying ? 'Pausar vídeo' : 'Reanudar vídeo'} onClick={toggleVideo} style={{ position: 'static' }}>
                            {videoPlaying ? (
                                <svg id="heroIcon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                                    <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" />
                                    <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" />
                                </svg>
                            ) : (
                                <svg id="heroIcon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                                    <path d="M7 4v16l13-8z" fill="currentColor" />
                                </svg>
                            )}
                        </button>
                        <button className="hero-toggle" id="heroAudioToggle" aria-label={musicPlaying ? 'Silenciar música' : 'Activar música'} onClick={toggleMusic} style={{ position: 'static' }}>
                            {musicPlaying ? (
                                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" fill="currentColor" />
                                </svg>
                            ) : (
                                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.21.05-.42.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" fill="currentColor" />
                                </svg>
                            )}
                        </button>
                    </div>
                    <div className={`hero-caption ${showCaption ? 'show' : ''}`} id="heroCaption" aria-live="polite">
                        <span className="cap-num" id="capNum">
                            Escena {String(currentScene + 1).padStart(2, '0')} / {String(MARKS.length).padStart(2, '0')}
                        </span>
                        <div className="cap-title" id="capTitle">{CAPTIONS[currentScene]}</div>
                        <div className="cap-under"></div>
                    </div>
                    <nav className="hero-script" id="heroScript" aria-label="Escenas del vídeo de presentación">
                        {CAPTIONS.map((cap, i) => (
                            <a
                                key={i}
                                className={`scene ${i < currentScene ? 'done' : ''} ${i === currentScene ? 'running' : ''}`}
                                href="#especialidades"
                                onClick={(e) => handleSceneClick(e, i)}
                            >
                                <i style={{ width: `${progressPercent[i]}%` }}></i>
                                <b>ESCENA {String(i + 1).padStart(2, '0')}</b>
                                <span>{cap}</span>
                            </a>
                        ))}
                    </nav>
                </div>
            </section>

            {/* ===================== FRANJA DE DATOS ===================== */}
            <section className="strip" aria-label="La clínica en cifras">
                <div className="strip-inner">
                    <div className="item free">
                        <b>1ª visita gratis</b>
                        <span>Estudio completo, radiografía y presupuesto por escrito, sin compromiso.</span>
                    </div>
                    <div className="item">
                        <b>40 años</b>
                        <span>de experiencia cuidando la salud bucal de generaciones enteras.</span>
                    </div>
                    <div className="item">
                        <b>Paseo Imperial 31</b>
                        <span>Arganzuela, Madrid — con acceso adaptado y luz natural.</span>
                    </div>
                    <div className="item">
                        <b>Financiación</b>
                        <span>Hasta 24 meses sin intereses. Pago con Stripe seguro.</span>
                    </div>
                </div>
            </section>

            {/* ===================== EQUIPO MÉDICO (foto + biografía + valoración) ===================== */}
            <section className="team" id="equipo">
                <div className="wrap border-box">
                    <div className="spec-head">
                        <div>
                            <span className="eyebrow">Nuestro equipo médico</span>
                            <h2 className="title">Los doctores que <em>firman cada sonrisa</em></h2>
                        </div>
                        <p className="section-intro">
                            Tres especialistas, seis áreas y una regla que no cambia desde 1985: cada tratamiento lo dirige el doctor formado específicamente en él. La valoración de cada uno se construye con las opiniones reales de pacientes y una verificación complementaria de agentes de IA especializados.
                        </p>
                    </div>

                    <div className="team-grid">
                        {/* Dr. Javier Alonso Martín */}
                        <article className="doctor-card">
                            <div className="doctor-photo">
                                <img src="images/team/alonso.jpg" alt="Fotografía del Dr. Javier Alonso Martín" loading="lazy" />
                            </div>
                            <div className="doctor-body">
                                <span className="rol">Director médico</span>
                                <h3>Dr. Javier Alonso Martín</h3>
                                <div className="rating" aria-label="Valoración 4,9 sobre 5 basada en 187 opiniones">
                                    <div className="stars" aria-hidden="true">★★★★★</div>
                                    <div className="rating-txt">
                                        <b>4,9</b> · 187 opiniones · <span className="ai">IA verificada</span>
                                    </div>
                                </div>
                                <ul className="doctor-bio">
                                    <li>Licenciado en Odontología (UCM, 2008).</li>
                                    <li>Máster en Ortodoncia y Ortopedia Dentofacial (UCM).</li>
                                    <li>Experto en Periodoncia y Medicina Oral.</li>
                                    <li>Más de 15 años de experiencia en rehabilitación oral.</li>
                                    <li>Director médico de la clínica.</li>
                                </ul>
                                <div className="doctor-areas">
                                    <b>Áreas:</b>
                                    <span>Ortodoncia</span>
                                    <span>Periodoncia</span>
                                    <span>Prótesis dental</span>
                                </div>
                            </div>
                        </article>

                        {/* Dr. Carlos Medina Rivas */}
                        <article className="doctor-card">
                            <div className="doctor-photo">
                                <img src="images/team/medina.jpg" alt="Fotografía del Dr. Carlos Medina Rivas" loading="lazy" />
                            </div>
                            <div className="doctor-body">
                                <span className="rol">Cirugía e implantología</span>
                                <h3>Dr. Carlos Medina Rivas</h3>
                                <div className="rating" aria-label="Valoración 4,8 sobre 5 basada en 142 opiniones">
                                    <div className="stars" aria-hidden="true">★★★★★</div>
                                    <div className="rating-txt">
                                        <b>4,8</b> · 142 opiniones · <span className="ai">IA verificada</span>
                                    </div>
                                </div>
                                <ul className="doctor-bio">
                                    <li>Licenciado en Odontología (Univ. Sevilla, 2009).</li>
                                    <li>Máster en Cirugía Bucal e Implantología.</li>
                                    <li>Especialista en cirugía guiada y regeneración ósea.</li>
                                    <li>Participante activo en congresos de implantología.</li>
                                </ul>
                                <div className="doctor-areas">
                                    <b>Áreas:</b>
                                    <span>Cirugía oral</span>
                                    <span>Implantes</span>
                                    <span>Rehabilitaciones completas</span>
                                </div>
                            </div>
                        </article>

                        {/* Dra. Laura Sánchez Ríos */}
                        <article className="doctor-card">
                            <div className="doctor-photo">
                                <img src="images/team/sanchez.jpg" alt="Fotografía de la Dra. Laura Sánchez Ríos" loading="lazy" />
                            </div>
                            <div className="doctor-body">
                                <span className="rol">Estética dental</span>
                                <h3>Dra. Laura Sánchez Ríos</h3>
                                <div className="rating" aria-label="Valoración 4,9 sobre 5 basada en 96 opiniones">
                                    <div className="stars" aria-hidden="true">★★★★★</div>
                                    <div className="rating-txt">
                                        <b>4,9</b> · 96 opiniones · <span className="ai">IA verificada</span>
                                    </div>
                                </div>
                                <ul className="doctor-bio">
                                    <li>Licenciada en Odontología (URJC, 2010).</li>
                                    <li>Máster en Odontología Estética y Rehabilitación.</li>
                                    <li>Formada en Diseño Digital de la Sonrisa y fotografía dental clínica.</li>
                                    <li>Enfoque conservador y mínimamente invasivo.</li>
                                </ul>
                                <div className="doctor-areas">
                                    <b>Áreas:</b>
                                    <span>Carillas</span>
                                    <span>Blanqueamientos</span>
                                    <span>Rehabilitación estética</span>
                                </div>
                            </div>
                        </article>
                    </div>

                    {/* Compromiso del equipo */}
                    <div className="commitment">
                        <div className="commitment-title">
                            <span className="eyebrow">Compromiso del equipo</span>
                            <h3>Lo que no cambia, <em>cuidemos lo que cuidemos</em></h3>
                        </div>
                        <ul className="commitment-list">
                            <li>
                                <div className="ico" aria-hidden="true">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <b>Formación continua</b>
                                    <p>Actualización científica constante en congresos, cursos y programas de máster. Lo que aprendemos hoy, aplicamos mañana en consulta.</p>
                                </div>
                            </li>
                            <li>
                                <div className="ico" aria-hidden="true">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10" />
                                        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                                        <line x1="9" y1="9" x2="9.01" y2="9" />
                                        <line x1="15" y1="9" x2="15.01" y2="9" />
                                    </svg>
                                </div>
                                <div>
                                    <b>Tecnología y materiales de primera</b>
                                    <p>Radiología digital, IA diagnóstica, cirugía guiada y materiales premium. Sin ahorrar donde no toca ahorrar.</p>
                                </div>
                            </li>
                            <li>
                                <div className="ico" aria-hidden="true">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <b>Trato cercano y comunicación clara</b>
                                    <p>Te explicamos cada paso sin tecnicismos ni prisa. Nada de sorpresas: presupuesto cerrado por escrito y opciones que puedes entender.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* ===================== ESPECIALIDADES (6 tarjetas compactas) ===================== */}
            <section className="spec" id="especialidades">
                <div className="wrap">
                    <div className="spec-head">
                        <div>
                            <span className="eyebrow">Seis especialidades</span>
                            <h2 className="title">Todo lo que necesita tu boca, <em>bajo un mismo techo</em></h2>
                        </div>
                        <p className="section-intro">
                            Cada tratamiento con precio orientativo "desde" y con el doctor especialista que lo firma. En tu primera visita gratis salimos con presupuesto cerrado por escrito.
                        </p>
                    </div>

                    <div className="spec-grid">
                        <article className="spec-card">
                            <div className="top">
                                <img className="mini" src="images/team/medina.jpg" alt="Dr. Carlos Medina" />
                                <div>
                                    <h3>Implantes dentales</h3>
                                    <div className="doc">
                                        <b>Dr. Carlos Medina Rivas</b> · Cirujano bucal
                                    </div>
                                </div>
                            </div>
                            <p>Implantes unitarios, arcadas completas, carga inmediata y regeneración ósea con cirugía guiada por ordenador.</p>
                            <div className="foot">
                                <div className="price">
                                    Implante <b>desde 850 €</b>
                                </div>
                                <Link href="/especialidades/implantes-dentales" className="more">Saber más →</Link>
                            </div>
                        </article>

                        <article className="spec-card">
                            <div className="top">
                                <img className="mini" src="images/team/alonso.jpg" alt="Dr. Javier Alonso" />
                                <div>
                                    <h3>Ortodoncia</h3>
                                    <div className="doc">
                                        <b>Dr. Javier Alonso Martín</b> · Director médico
                                    </div>
                                </div>
                            </div>
                            <p>Brackets metálicos y estéticos, alineadores invisibles tipo Invisalign y ortodoncia interceptiva infantil.</p>
                            <div className="foot">
                                <div className="price">
                                    Alineadores <b>desde 3.000 €</b>
                                </div>
                                <Link href="/especialidades/ortodoncia" className="more">Saber más →</Link>
                            </div>
                        </article>

                        <article className="spec-card">
                            <div className="top">
                                <img className="mini" src="images/team/sanchez.jpg" alt="Dra. Laura Sánchez" />
                                <div>
                                    <h3>Odontología estética</h3>
                                    <div className="doc">
                                        <b>Dra. Laura Sánchez Ríos</b> · Estética dental
                                    </div>
                                </div>
                            </div>
                            <p>Blanqueamientos profesionales, carillas de porcelana y composite, cierre de espacios y Diseño Digital de la Sonrisa.</p>
                            <div className="foot">
                                <div className="price">
                                    Blanqueamiento <b>desde 320 €</b>
                                </div>
                                <Link href="/especialidades/odontologia-estetica" className="more">Saber más →</Link>
                            </div>
                        </article>

                        <article className="spec-card">
                            <div className="top">
                                <img className="mini" src="images/team/alonso.jpg" alt="Dr. Javier Alonso" />
                                <div>
                                    <h3>Prótesis dental</h3>
                                    <div className="doc">
                                        <b>Dr. Javier Alonso Martín</b> · Director médico
                                    </div>
                                </div>
                            </div>
                            <p>Coronas de zirconio, puentes, prótesis sobre implantes y prótesis removibles con materiales premium.</p>
                            <div className="foot">
                                <div className="price">
                                    Corona zirconio <b>desde 420 €</b>
                                </div>
                                <Link href="/especialidades/protesis-dental" className="more">Saber más →</Link>
                            </div>
                        </article>

                        <article className="spec-card">
                            <div className="top">
                                <img className="mini" src="images/team/alonso.jpg" alt="Dr. Javier Alonso" />
                                <div>
                                    <h3>Periodoncia</h3>
                                    <div className="doc">
                                        <b>Dr. Javier Alonso Martín</b> · Director médico
                                    </div>
                                </div>
                            </div>
                            <p>Salud de las encías: diagnóstico periodontal, curetajes, mantenimientos y educación en higiene para toda la vida.</p>
                            <div className="foot">
                                <div className="price">
                                    Limpieza <b>desde 55 €</b>
                                </div>
                                <Link href="/especialidades/periodoncia" className="more">Saber más →</Link>
                            </div>
                        </article>

                        <article className="spec-card">
                            <div className="top">
                                <img className="mini" src="images/team/medina.jpg" alt="Dr. Carlos Medina" />
                                <div>
                                    <h3>Cirugía bucal</h3>
                                    <div className="doc">
                                        <b>Dr. Carlos Medina Rivas</b> · Cirujano bucal
                                    </div>
                                </div>
                            </div>
                            <p>Extracción de muelas del juicio y raíces, cirugía de tejidos blandos y frenectomías. Cirugías viernes tarde y sábados.</p>
                            <div className="foot">
                                <div className="price">
                                    Extracción <b>desde 80 €</b>
                                </div>
                                <Link href="/especialidades/cirugia-bucal" className="more">Saber más →</Link>
                            </div>
                        </article>
                    </div>
                </div>
            </section>

            {/* ===================== TECNOLOGÍA (carrusel) ===================== */}
            <section className="tech" id="tecnologia">
                <div className="tech-head">
                    <div>
                        <span className="eyebrow">Tecnología avanzada</span>
                        <h2 className="title">La tecnología que <em>se nota</em> en cada visita</h2>
                    </div>
                    <div className="tech-nav">
                        <button id="prevBtn" aria-label="Anterior" onClick={goPrevSlide}>←</button>
                        <button id="nextBtn" aria-label="Siguiente" onClick={goNextSlide}>→</button>
                    </div>
                </div>

                <div className="carousel">
                    <div
                        className="stage"
                        id="stage"
                        aria-roledescription="carrusel"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                    >
                        {SLIDES.map((slide, sIdx) => (
                            <article
                                key={sIdx}
                                className={`slide ${sIdx === activeSlide ? 'active' : ''}`}
                            >
                                <div className="slide-img">
                                    <img src={slide.image} alt={slide.title} />
                                </div>
                                <div className="slide-txt">
                                    <span className="num">
                                        {String(sIdx + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
                                    </span>
                                    <span className="eyebrow">{slide.eyebrow}</span>
                                    <h3>{slide.title}</h3>
                                    <p>{slide.description}</p>
                                    <div className="chips">
                                        {slide.chips.map((chip, cIdx) => (
                                            <span key={cIdx}>{chip}</span>
                                        ))}
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                    <div className="dots" id="dots" role="tablist">
                        {SLIDES.map((_, dotIdx) => (
                            <button
                                key={dotIdx}
                                role="tab"
                                aria-label={`Diapositiva ${dotIdx + 1}`}
                                className={dotIdx === activeSlide ? 'active' : ''}
                                onClick={() => setActiveSlide(dotIdx)}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* ===================== OPINIONES DE PACIENTES ===================== */}
            <section className="reviews-sec" id="opiniones" style={{ padding: 'clamp(4rem, 8vw, 6.5rem) 0', borderTop: '1px solid var(--linea)', backgroundColor: '#FAF9F5' }}>
                <div className="wrap">
                    <div className="spec-head" style={{ marginBottom: '3rem' }}>
                        <div>
                            <span className="eyebrow" style={{ color: 'var(--rojo)' }}>Nuestros pacientes opinan</span>
                            <h2 className="title">La confianza de quienes nos eligen</h2>
                        </div>
                        <p className="section-intro">
                            La confianza y las recomendaciones de nuestros pacientes forman parte de la historia de Clínica Dental Río Piedras.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.6rem' }}>
                        <div style={{ background: '#fff', border: '1px solid var(--linea)', padding: '2rem 1.8rem', borderRadius: '1.2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem', boxShadow: 'var(--shadow-card)' }}>
                            <p style={{ fontStyle: 'italic', fontSize: '0.92rem', color: 'var(--tinta)', lineHeight: '1.65', margin: 0 }}>
                                “¡Excelente! En Clínica Dental Río Piedras está el mejor equipo de profesionales que puedas encontrar. Son amables, ofrecen una atención impecable y responden a todas tus preguntas con empatía y eficacia. Demuestran un nivel de calidad y compromiso muy alto. Estoy muy agradecido.”
                            </p>
                            <div style={{ borderTop: '1px solid var(--linea)', paddingTop: '0.8rem', fontWeight: 600, fontSize: '0.88rem', color: 'var(--azul-osc)' }}>
                                Manuel Gómez Raya
                            </div>
                        </div>

                        <div style={{ background: '#fff', border: '1px solid var(--linea)', padding: '2rem 1.8rem', borderRadius: '1.2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem', boxShadow: 'var(--shadow-card)' }}>
                            <p style={{ fontStyle: 'italic', fontSize: '0.92rem', color: 'var(--tinta)', lineHeight: '1.65', margin: 0 }}>
                                “Llegué a Clínica Dental Río Piedras por recomendación de un amigo y ahora soy yo quien la recomienda a todos los míos. Destacaría, sin dudarlo, el trato cercano, tranquilizador y profesional de todo el personal. Entrar en la clínica es tener la sensación de estar en buenas manos, con una atención cálida y muy personalizada.”
                            </p>
                            <div style={{ borderTop: '1px solid var(--linea)', paddingTop: '0.8rem', fontWeight: 600, fontSize: '0.88rem', color: 'var(--azul-osc)' }}>
                                José Ángel Morales
                            </div>
                        </div>

                        <div style={{ background: '#fff', border: '1px solid var(--linea)', padding: '2rem 1.8rem', borderRadius: '1.2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem', boxShadow: 'var(--shadow-card)' }}>
                            <p style={{ fontStyle: 'italic', fontSize: '0.92rem', color: 'var(--tinta)', lineHeight: '1.65', margin: 0 }}>
                                “Acudí a la clínica por recomendación de un amigo. Desde la primera visita se perciben la seriedad y la profesionalidad del equipo, pero lo mejor es su simpatía y su preocupación por el bienestar del paciente. Ahora soy yo quien los recomienda. Gracias por ayudarme a mejorar mi sonrisa.”
                            </p>
                            <div style={{ borderTop: '1px solid var(--linea)', paddingTop: '0.8rem', fontWeight: 600, fontSize: '0.88rem', color: 'var(--azul-osc)' }}>
                                David Fernández Aguilera
                            </div>
                        </div>

                        <div style={{ background: '#fff', border: '1px solid var(--linea)', padding: '2rem 1.8rem', borderRadius: '1.2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem', boxShadow: 'var(--shadow-card)' }}>
                            <p style={{ fontStyle: 'italic', fontSize: '0.92rem', color: 'var(--tinta)', lineHeight: '1.65', margin: 0 }}>
                                “La atención recibida es inigualable. Desde la recepción hasta los doctores, todo el equipo te hace sentir fenomenal. La calidad del servicio y los resultados son de primer nivel. Tengo plena confianza en la clínica y la recomiendo al cien por cien.”
                            </p>
                            <div style={{ borderTop: '1px solid var(--linea)', paddingTop: '0.8rem', fontWeight: 600, fontSize: '0.88rem', color: 'var(--azul-osc)' }}>
                                Teresa Rambaldi González
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===================== CANALES DE COMUNICACIÓN ===================== */}
            <section className="channels" id="canales">
                <div className="wrap">
                    <span className="eyebrow">Cómo te acompañamos</span>
                    <h2 className="title">Cuatro formas de estar cerca, <em>elige tú</em></h2>
                    <p className="section-intro">
                        Reservar cita, mandar una duda, recibir un recordatorio o revisar tu tratamiento: hazlo por el canal que más te apetezca. Tu historial se sincroniza automáticamente entre todos.
                    </p>

                    <div className="chan-grid">
                        <article className="chan">
                            <div className="chan-icon wa">
                                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.9c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.8 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2m0 18.15c-1.53 0-3.03-.41-4.34-1.18l-.31-.19-3.24.85.86-3.16-.2-.32c-.84-1.34-1.29-2.89-1.29-4.48 0-4.65 3.79-8.43 8.44-8.43 2.25 0 4.36.88 5.95 2.47 1.59 1.59 2.47 3.7 2.47 5.95-.01 4.65-3.79 8.44-8.44 8.44m4.63-6.31c-.25-.13-1.5-.74-1.73-.82-.23-.09-.4-.13-.57.13-.17.25-.65.82-.79.99-.15.17-.29.19-.54.06-.25-.13-1.07-.4-2.04-1.26-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.13-.15.17-.25.25-.42.09-.17.04-.31-.02-.44-.06-.13-.57-1.38-.79-1.88-.21-.5-.42-.43-.57-.43-.15-.01-.31-.01-.48-.01-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.02 2.56.13.17 1.76 2.67 4.25 3.75.59.26 1.06.41 1.42.52.6.19 1.14.16 1.57.1.48-.07 1.5-.61 1.71-1.21.21-.6.21-1.11.15-1.21-.06-.11-.23-.17-.48-.29z" />
                                </svg>
                            </div>
                            <span className="badge-lite">Canal preferido · 24/7</span>
                            <h3>WhatsApp Business</h3>
                            <p>Escríbenos, manda una foto de una molestia o pide cita. Respondemos en horas y todo queda en tu historial. Perfecto para dudas rápidas.</p>
                        </article>

                        <article className="chan">
                            <div className="chan-icon tg">
                                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.05-.19-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38" />
                                </svg>
                            </div>
                            <span className="badge-lite">Notificaciones · Bot</span>
                            <h3>Telegram</h3>
                            <p>Recordatorios automáticos de citas, envío de radiografías, presupuestos y recetas. Si prefieres Telegram a WhatsApp, tenemos bot propio.</p>
                        </article>

                        <article className="chan">
                            <div className="chan-icon app">
                                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="5" y="2" width="14" height="20" rx="2.5" />
                                    <line x1="12" y1="18" x2="12.01" y2="18" />
                                </svg>
                            </div>
                            <span className="badge-lite">iOS · Android · Web</span>
                            <h3>App a medida</h3>
                            <p>Portal del paciente con calendario de citas, historial de tratamientos, radiografías, presupuestos, pagos con Stripe y descarga de facturas.</p>
                        </article>

                        <article className="chan">
                            <div className="chan-icon tel">
                                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                </svg>
                            </div>
                            <span className="badge-lite">Voz IA · Recordatorios</span>
                            <h3>Agente telefónico IA</h3>
                            <p>Un asistente de voz automatizado te llama para confirmar tu cita, recordarte instrucciones post-operatorias y hacer seguimiento del tratamiento. Sin colas y sin robots frustrantes.</p>
                        </article>
                    </div>
                </div>
            </section>

            {/* ===================== PORTAL DEL PACIENTE (con Stripe) ===================== */}
            <section className="portal" id="portal">
                <div className="wrap portal-inner">
                    <div>
                        <span className="eyebrow">Portal del paciente</span>
                        <h2 className="title">Reserva, paga y sigue tu tratamiento <em>desde donde quieras</em></h2>
                        <p className="portal-lead">
                            Un portal seguro donde tienes toda tu vida dental en un solo sitio: próximas citas, radiografías, presupuestos, tratamientos en curso y facturación. Pago con Stripe, financiación hasta 24 meses y aviso de cada movimiento por el canal que hayas elegido.
                        </p>
                        <ul className="portal-features">
                            <li>
                                <span>
                                    <b>Reserva tu primera visita gratis</b> con un par de clics y elige el doctor especialista que necesitas.
                                </span>
                            </li>
                            <li>
                                <span>
                                    <b>Gestión de derechos en 1 clic:</b> Acceso y portabilidad (exportar JSON/PDF), Rectificación, Oposición al marketing e IA, y Derecho al olvido (marcado y borrado a 30 días) vía email tokenizado de un solo uso.
                                </span>
                            </li>
                            <li>
                                <span>
                                    <b>Seguimiento clínico y retención:</b> Gestión de consentimientos explícitos. Los audios de llamadas IA se destruyen a los 90 días automáticamente según norma clínica.
                                </span>
                            </li>
                            <li>
                                <span>
                                    <b>Seguridad reforzada:</b> Doble factor de autenticación (MFA) obligatorio para el personal y doctores. Todos los accesos a datos médicos se registran de forma inmutable.
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Mockup del portal (no funcional, solo prototipo visual) */}
                    <div className="portal-mock" aria-hidden="true">
                        <div className="pm-head">
                            <div className="who">
                                Hola, José Ignacio
                                <small>Paciente desde marzo 2024 · Próxima cita: 24 jul</small>
                            </div>
                            <div className="exit">Salir</div>
                        </div>
                        <div className="pm-cards">
                            <div className="pm-card free">
                                <b>Tu próxima visita</b>
                                <span>Gratis</span>
                                <small>Revisión anual con Dr. Alonso</small>
                            </div>
                            <div className="pm-card">
                                <b>Tratamiento activo</b>
                                <span>1.240 €</span>
                                <small>2 de 6 sesiones completadas</small>
                            </div>
                            <div className="pm-card">
                                <b>Saldo pendiente</b>
                                <span>0 €</span>
                                <small>Al día con la financiación</small>
                            </div>
                        </div>
                        <div className="pm-form">
                            <label>Tus datos personales</label>
                            <div className="pm-form-row">
                                <div className="field">José Ignacio Gómez</div>
                                <div className="field">jigomez@ejemplo.com</div>
                            </div>
                            <div className="pm-form-row">
                                <div className="field">+34 649 45 39 96</div>
                                <div className="field">Canal preferido: WhatsApp</div>
                            </div>
                        </div>
                        <div className="pm-pay">
                            <div className="amt">
                                <small>Próximo plazo</small>
                                206,67 €
                            </div>
                            <button className="stripe-btn" type="button">
                                Pagar con
                                <svg viewBox="0 0 60 25" width="40" height="18" xmlns="http://www.w3.org/2000/svg" aria-label="Stripe">
                                    <path fill="#635BFF" d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a8.33 8.33 0 0 1-4.56 1.1c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.5 0 .4-.04 1.26-.06 1.48zm-5.92-5.62c-1.03 0-2.17.73-2.17 2.58h4.25c0-1.85-1.07-2.58-2.08-2.58zM40.95 20.3c-1.44 0-2.32-.6-2.9-1.04l-.02 4.63-4.12.87V5.57h3.63l.21 1.02a4.7 4.7 0 0 1 3.23-1.29c2.89 0 5.62 2.6 5.62 7.4 0 5.23-2.7 7.6-5.65 7.6zM40 8.95c-.95 0-1.54.34-1.97.81l.02 6.12c.4.44.98.78 1.95.78 1.52 0 2.54-1.65 2.54-3.87 0-2.15-1.04-3.84-2.54-3.84zM28.24 5.57h4.13v14.44h-4.13V5.57zm0-4.7L32.37 0v3.36l-4.13.88V.88zm-4.32 9.35v9.79H19.8V5.57h3.7l.27 1.22c1-1.77 3.07-1.41 3.62-1.22v3.79c-.52-.17-2.29-.43-3.47 1.86zm-8.55 4.72c0 2.43 2.6 1.68 3.12 1.46v3.36c-.55.3-1.54.54-2.89.54a4.15 4.15 0 0 1-4.27-4.24l.01-13.17 4.02-.86v3.54h3.14V9.1h-3.13v5.85zm-4.91.7c0 2.97-2.31 4.66-5.73 4.66a11.2 11.2 0 0 1-4.46-.93v-3.93c1.38.75 3.1 1.31 4.46 1.31.92 0 1.58-.24 1.58-1C6.31 13.77 0 14.51 0 9.95 0 7.04 2.28 5.3 5.62 5.3c1.36 0 2.72.2 4.09.75v3.88a9.23 9.23 0 0 0-4.1-1.06c-.86 0-1.44.25-1.44.9 0 1.85 6.29.97 6.29 5.88z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===================== INFRAESTRUCTURA Y CUMPLIMIENTO ===================== */}
            <section className="privacy-sec" id="privacidad" style={{ padding: 'clamp(4rem, 8vw, 6.5rem) 0', borderTop: '1px solid var(--linea)' }}>
                <div className="wrap">
                    <div className="spec-head" style={{ marginBottom: '3rem' }}>
                        <div>
                            <span className="eyebrow" style={{ color: 'var(--rojo)' }}>Garantías de Nivel Clínico</span>
                            <h2 className="title">Seguridad y Privacidad por Diseño</h2>
                        </div>
                        <p className="section-intro">
                            Tratamos tus datos de salud bajo la categoría especial del Art. 9 del RGPD. Nuestra infraestructura está diseñada desde el esquema de base de datos para garantizar los más altos estándares legales y técnicos.
                        </p>
                    </div>

                    <div className="team-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.6rem' }}>
                        <div className="doctor-card" style={{ padding: '2rem 1.8rem', background: '#fff', border: '1px solid var(--linea)', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            <div style={{ color: 'var(--azul)', fontSize: '1.25rem', fontWeight: 'bold' }}>🔒 Cifrado y Tránsito</div>
                            <p style={{ fontSize: '0.88rem', color: 'var(--tinta-suave)', lineHeight: '1.6' }}>
                                TLS 1.2+ obligatorio y HSTS en tránsito. Almacenamiento cifrado con <strong>LUKS</strong> para partición de datos <code>/data</code>, cifrado a nivel de columna (pgcrypto) para nombres, DNIs y teléfonos, y contraseñas seguras con <strong>Argon2id</strong>.
                            </p>
                        </div>
                        <div className="doctor-card" style={{ padding: '2rem 1.8rem', background: '#fff', border: '1px solid var(--linea)', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            <div style={{ color: 'var(--azul)', fontSize: '1.25rem', fontWeight: 'bold' }}>📋 Auditoría y RAT</div>
                            <p style={{ fontSize: '0.88rem', color: 'var(--tinta-suave)', lineHeight: '1.6' }}>
                                Registro de Actividades de Tratamiento (RAT) documentado en <code>docs/rgpd/rat.md</code>. Cada acceso de lectura a pacientes o historias se registra inmutablemente en <code>audit_log</code>. Backups externos encriptados con <strong>age</strong>.
                            </p>
                        </div>
                        <div className="doctor-card" style={{ padding: '2rem 1.8rem', background: '#fff', border: '1px solid var(--linea)', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            <div style={{ color: 'var(--azul)', fontSize: '1.25rem', fontWeight: 'bold' }}>⚖️ DPO y Derechos</div>
                            <p style={{ fontSize: '0.88rem', color: 'var(--tinta-suave)', lineHeight: '1.6' }}>
                                Supervisado por un <strong>Delegado de Protección de Datos (DPO)</strong> externo especializado en entornos de salud. Canales y endpoints dedicados para ejercicio seguro de revocación de consentimiento, portabilidad y oposición rápida.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===================== PRIMERA VISITA ===================== */}
            <section className="visit" id="primera-visita">
                <div className="wrap">
                    <span className="eyebrow">Cómo funciona</span>
                    <h2 className="title">Tu primera visita <em>gratis</em>, paso a paso</h2>
                    <div className="visit-grid">
                        <article className="step">
                            <h3>Reserva por el canal que prefieras</h3>
                            <p>WhatsApp, Telegram, teléfono o desde el portal. Si quieres, adjunta fotos hechas con el móvil para adelantar trabajo.</p>
                        </article>
                        <article className="step">
                            <h3>Estudio diagnóstico completo</h3>
                            <p>Radiografía panorámica y pruebas de imagen en la propia clínica, con análisis asistido por IA. Todo gratis.</p>
                        </article>
                        <article className="step">
                            <h3>Plan y presupuesto cerrado</h3>
                            <p>Sales con un plan personalizado explicado con claridad y presupuesto por escrito, con opciones de financiación.</p>
                        </article>
                        <article className="step">
                            <h3>Tratamiento y seguimiento</h3>
                            <p>En consulta o a distancia: agente de voz IA, recordatorios y videoconsulta cuando lo necesites.</p>
                        </article>
                    </div>
                </div>
            </section>

            {/* ===================== CONTACTO ===================== */}
            <section className="contact" id="contacto">
                <div className="wrap contact-inner">
                    <div>
                        <span className="eyebrow">Pide tu cita</span>
                        <h2 className="title">Cuarenta años después, seguimos <em>a cinco minutos de ti</em></h2>
                        <p className="big">
                            En el corazón de Arganzuela, con recepción luminosa, acceso adaptado y un equipo que te llama por tu nombre. Tu primera visita —radiografía y presupuesto incluidos— es siempre gratis.
                        </p>
                    </div>
                    <div className="contact-card">
                        <span className="eyebrow">Clínica Dental Ríos Piedras</span>
                        <dl>
                            <div>
                                <dt>Dirección</dt>
                                <dd>C/ Paseo Imperial 31, 28005 Madrid — Barrio del Pasillo Verde (Arganzuela)</dd>
                            </div>
                            <div>
                                <dt>Horario</dt>
                                <dd>
                                    Lunes a viernes: 9:30–14:00 y 16:00–20:00
                                    <br />
                                    Cirugías: viernes tarde y sábado por la mañana (con cita)
                                </dd>
                            </div>
                            <div>
                                <dt>Canales</dt>
                                <dd>WhatsApp · Telegram · Portal web · Llamada</dd>
                            </div>
                        </dl>
                        <a className="btn-solid" href="#contacto" onClick={() => setAssistantOpen(true)}>Reserva tu primera visita gratis →</a>
                    </div>
                </div>
            </section>

            <footer className="foot">
                <b>Clínica Dental Ríos Piedras</b> · C/ Paseo Imperial 31, 28005 Madrid · L–V 9:30–14:00 / 16:00–20:00
                <br />
                Integrado en Next.js · Diseñado con CSS Vanilla
            </footer>

            {/* ===================== BURBUJA DE ASISTENTE ===================== */}
            {!assistantOpen && (
                <>
                    <a
                        href={`${process.env.NEXT_PUBLIC_CLINICA_URL || "https://clinicadentalriopiedras.n8njigretera.cloud/"}Citas/PublicoSimulador?doctorCorreo=jigomez@hotmail.com`}
                        className="btn btn-outline-primary d-flex flex-column align-items-start simulador-btn"
                        target="_blank"
                        rel="noopener noreferrer"
                        id="simuladorBtn"
                    >
                        <span><i className="fas fa-stethoscope me-1"></i> Solicitar diagnóstico</span>
                        <small className="text-muted">Te responderá el doctor cuando le sea posible</small>
                    </a>
                    <button
                        className="assistant-btn"
                        id="assistBtn"
                        aria-label="Abrir asistente de la clínica"
                        aria-expanded="false"
                        onClick={() => setAssistantOpen(true)}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                    </button>
                </>
            )}

            <aside className={`assistant ${assistantOpen ? 'open' : ''}`} id="assistPanel" role="dialog" aria-labelledby="assistTitle">
                <div className="a-head">
                    <div className="a-logo">
                        <img src="images/logo-clinica.png" alt="Logo" />
                    </div>
                    <div>
                        <b id="assistTitle">Asistente Dental</b>
                        <small>CLÍNICA RÍOS PIEDRAS</small>
                    </div>
                    <button className="a-close" id="assistClose" aria-label="Cerrar" onClick={() => setAssistantOpen(false)}>
                        ×
                    </button>
                </div>
                <div className="a-body">
                    <h4>¡Hola! ¿Cómo prefieres que te atendamos?</h4>
                    <p className="hint">Recuerda que tu primera visita —con radiografía y presupuesto— es gratis y sin compromiso.</p>
                    <button className="a-btn" type="button">
                        <span className="ico wa">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.9c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.8 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2" />
                            </svg>
                        </span>
                        Continuar por WhatsApp
                    </button>
                    <button className="a-btn" type="button">
                        <span className="ico tg">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2" />
                            </svg>
                        </span>
                        Continuar por Telegram
                    </button>
                    <button className="a-btn" type="button">
                        <span className="ico em">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                <polyline points="22,6 12,13 2,6" />
                            </svg>
                        </span>
                        Continuar por Email
                    </button>
                    <button className="a-btn web" type="button">
                        <span className="ico wb">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                            </svg>
                        </span>
                        Continuar en esta web
                    </button>
                    <button className="a-btn reserva" type="button">
                        <span className="ico">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </span>
                        Reservar mi primera visita gratis
                    </button>
                </div>
                <div className="a-foot">
                    Pago seguro con <b>Stripe</b> · Financiación hasta 24 meses
                </div>
            </aside>
        </>
    );
}
