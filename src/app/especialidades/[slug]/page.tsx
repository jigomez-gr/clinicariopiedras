import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Doctor {
    slug: string;
    name: string;
    role: string;
    image: string;
    education: string[];
    specialties: string[];
    biography: string;
    registrationNumber?: string;
    experience?: string;
}

interface Specialty {
    slug: string;
    title: string;
    price: string;
    description: string;
    cases: string[];
    doctorSlug: string;
}

const DOCTORS: Record<string, Doctor> = {
    "dr-carlos-medina-rivas": {
        slug: "dr-carlos-medina-rivas",
        name: "Dr. Carlos Medina Rivas",
        role: "Cirugía oral, implantología y rehabilitación avanzada",
        image: "/images/team/dr-carlos-medina-rivas.png",
        education: [
            "Licenciado en Odontología",
            "Formación avanzada en Cirugía Oral",
            "Formación especializada en Implantología",
            "Formación en Regeneración Ósea",
            "Formación en Rehabilitación Oral y Prótesis sobre Implantes",
            "Actualización en planificación digital y cirugía implantológica"
        ],
        specialties: [
            "Cirugía oral",
            "Implantología",
            "Regeneración ósea",
            "Prótesis sobre implantes",
            "Rehabilitación completa"
        ],
        biography: "El Dr. Carlos Medina Rivas desarrolla su actividad principalmente en las áreas de cirugía oral, implantología y rehabilitación de casos complejos.\n\nA lo largo de su trayectoria se ha especializado en el estudio y planificación de tratamientos destinados a recuperar dientes perdidos, mejorar la función masticatoria y rehabilitar la sonrisa de pacientes que requieren soluciones coordinadas.\n\nSu trabajo incluye procedimientos de implantología, cirugía oral, regeneración ósea y rehabilitaciones completas, siempre partiendo de una evaluación individual y de una explicación clara de las alternativas disponibles.\n\nEl Dr. Medina presta especial atención a la tranquilidad del paciente antes de cada procedimiento. Su manera de trabajar se basa en la planificación, la precisión, la comunicación y el seguimiento después del tratamiento.\n\nColabora con las distintas áreas de la clínica para abordar los casos desde una perspectiva conjunta, especialmente cuando es necesario coordinar cirugía, periodoncia, prótesis y estética.",
        registrationNumber: ""
    },
    "dr-javier-alonso-martin": {
        slug: "dr-javier-alonso-martin",
        name: "Dr. Javier Alonso Martín",
        role: "Director médico",
        image: "/images/team/javier-alonso-martin.webp",
        education: [
            "Licenciado en Odontología por la Universidad Complutense de Madrid, 2008",
            "Máster en Ortodoncia y Ortopedia Dentofacial",
            "Formación avanzada en Periodoncia y Medicina Oral"
        ],
        experience: "Más de 15 años de experiencia en rehabilitación oral",
        specialties: [
            "Ortodoncia",
            "Periodoncia",
            "Prótesis dental",
            "Rehabilitación oral",
            "Medicina oral"
        ],
        biography: "El Dr. Javier Alonso Martín es director médico de Clínica Dental Río Piedras y cuenta con más de 15 años de experiencia en rehabilitación oral.\n\nSu formación en Ortodoncia, Ortopedia Dentofacial, Periodoncia y Medicina Oral le permite estudiar los casos desde una perspectiva integral y coordinar diferentes tratamientos cuando resulta necesario.\n\nSu práctica se basa en el diagnóstico individual, la planificación rigurosa y una comunicación clara con el paciente durante todas las fases.",
        registrationNumber: ""
    },
    "dra-laura-sanchez-rios": {
        slug: "dra-laura-sanchez-rios",
        name: "Dra. Laura Sánchez Ríos",
        role: "Odontología estética y rehabilitación",
        image: "/images/team/laura-sanchez-rios.webp",
        education: [
            "Licenciada en Odontología por la Universidad Rey Juan Carlos, 2010",
            "Máster en Odontología Estética y Rehabilitación",
            "Formación en Diseño Digital de la Sonrisa",
            "Formación en fotografía dental"
        ],
        specialties: [
            "Carillas dentales",
            "Blanqueamiento dental",
            "Rehabilitación estética",
            "Diseño de sonrisa"
        ],
        biography: "La Dra. Laura Sánchez Ríos desarrolla su actividad principalmente en el campo de la odontología estética y la rehabilitación.\n\nSu trabajo se orienta a mejorar la salud, la función y la armonía de la sonrisa mediante tratamientos personalizados y planificados de acuerdo con las características de cada paciente.\n\nSu formación en Diseño Digital de la Sonrisa y fotografía dental le permite utilizar herramientas visuales que facilitan la planificación y ayudan al paciente a comprender las distintas posibilidades de tratamiento.\n\nSu forma de trabajar combina precisión, atención al detalle, escucha y una explicación clara de cada alternativa.",
        registrationNumber: ""
    }
};

const SPECIALTIES: Record<string, Specialty> = {
    "implantes-dentales": {
        slug: "implantes-dentales",
        title: "Implantes dentales",
        price: "desde 850 €",
        description: "Los implantes dentales son raíces artificiales de titanio que se colocan en el hueso maxilar para sustituir dientes perdidos. Permiten recuperar la función masticatoria completa y la estética natural de la sonrisa sin afectar a los dientes vecinos.",
        doctorSlug: "dr-carlos-medina-rivas",
        cases: [
            "Pérdida de uno o varios dientes nativos",
            "Ausencia completa de piezas dentales en una o ambas arcadas",
            "Necesidad de prótesis fijas sobre implantes (carga inmediata)",
            "Pacientes con reabsorción ósea que requieren técnicas de regeneración o elevación de seno"
        ]
    },
    "ortodoncia": {
        slug: "ortodoncia",
        title: "Ortodoncia",
        price: "desde 3.000 €",
        description: "La ortodoncia se encarga de corregir la posición de los dientes y los problemas de la mordida. Utilizamos sistemas modernos e invisibles como alineadores transparentes (Invisalign) y brackets estéticos para alinear tu sonrisa cómodamente.",
        doctorSlug: "dr-javier-alonso-martin",
        cases: [
            "Dientes apiñados o separados (diastemas)",
            "Problemas de oclusión: mordida cruzada, sobremordida o mordida abierta",
            "Malposiciones maxilares en niños y adultos",
            "Preparación previa para tratamientos de implantología o prótesis"
        ]
    },
    "odontologia-estetica": {
        slug: "odontologia-estetica",
        title: "Odontología estética",
        price: "desde 320 €",
        description: "Tratamientos diseñados para devolver la armonía, brillo y color natural a tu sonrisa. Combinamos carillas dentales de alta calidad con blanqueamiento clínico personalizado para lograr resultados sumamente naturales.",
        doctorSlug: "dra-laura-sanchez-rios",
        cases: [
            "Pérdida de color o manchas intrínsecas difíciles de blanquear",
            "Dientes astillados, desgastados o con formas irregulares",
            "Espacios entre dientes o leves desalineaciones estéticas",
            "Deseo de rejuvenecer y mejorar la estética global de la sonrisa"
        ]
    },
    "protesis-dental": {
        slug: "protesis-dental",
        title: "Prótesis dental",
        price: "desde 420 €",
        description: "Especialidad dedicada a restaurar la anatomía y función de una o varias piezas dentales mediante coronas de zirconio, puentes fijos o prótesis completas, diseñadas a medida con tecnología digital de vanguardia.",
        doctorSlug: "dr-javier-alonso-martin",
        cases: [
            "Pérdida de la corona natural del diente por caries severa o fractura",
            "Reposición de múltiples piezas con puentes soportados por dientes naturales",
            "Necesidad de prótesis removibles o híbridas de alta biocompatibilidad",
            "Desgaste dental generalizado"
        ]
    },
    "periodoncia": {
        slug: "periodoncia",
        title: "Periodoncia",
        price: "desde 55 €",
        description: "Tratamientos dedicados a cuidar la salud de las encías y los tejidos que soportan los dientes. Realizamos limpiezas profundas preventivas, curetajes clínicos y cirugía periodontal para frenar la pérdida de soporte dental.",
        doctorSlug: "dr-javier-alonso-martin",
        cases: [
            "Encías inflamadas, enrojecidas o que sangran durante el cepillado (gingivitis)",
            "Movilidad dental o retracción de encías (periodontitis o 'piorrea')",
            "Mal aliento persistente o sensibilidad inexplicable",
            "Mantenimiento periodontal preventivo anual"
        ]
    },
    "cirugia-bucal": {
        slug: "cirugia-bucal",
        title: "Cirugía bucal",
        price: "desde 80 €",
        description: "Procedimientos quirúrgicos en la cavidad oral realizados con anestesia local de última generación para asegurar la total comodidad del paciente. Abarca extracciones complejas de muelas del juicio, frenectomías y cirugía preprotésica.",
        doctorSlug: "dr-carlos-medina-rivas",
        cases: [
            "Muelas del juicio impactadas, dolorosas o mal posicionadas",
            "Extracciones dentales complejas o restos radiculares profundos",
            "Frenectomías (frenillo labial o lingual corto)",
            "Preparación ósea o gingival (cirugía preprotésica) antes de implantes"
        ]
    }
};

export async function generateStaticParams() {
    return Object.keys(SPECIALTIES).map((slug) => ({
        slug,
    }));
}

interface PageProps {
    params: Promise<{ slug: string }>
}

export default async function SpecialtyPage({ params }: PageProps) {
    const { slug } = await params;
    const spec = SPECIALTIES[slug];

    if (!spec) {
        notFound();
    }

    const doc = DOCTORS[spec.doctorSlug];

    return (
        <main className="bg-slate-50 min-h-screen text-slate-900" style={{ backgroundColor: '#FAF9F5', fontFamily: 'var(--font-instrument-sans)' }}>
            {/* Header / Navbar minimal */}
            <header className="border-b" style={{ borderColor: 'var(--linea)', backgroundColor: '#fff', position: 'sticky', top: 0, zIndex: 10 }}>
                <div className="wrap border-box" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0' }}>
                    <Link href="/" className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', textDecoration: 'none', color: 'inherit' }}>
                        <img src="/images/logo-clinica.png" alt="Logo Ríos Piedras" style={{ height: '36px', width: 'auto' }} />
                        <div className="txt" style={{ display: 'flex', flexDirection: 'column' }}>
                            <b style={{ color: 'var(--azul)', fontFamily: 'var(--font-fraunces)', fontSize: '1.2rem', lineHeight: 1.1 }}>Ríos Piedras</b>
                            <small style={{ fontSize: '0.68rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--tinta-suave)' }}>Clínica Dental</small>
                        </div>
                    </Link>
                    <Link href="/" className="btn-ghost" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem', border: '1px solid var(--linea)', borderRadius: '99px', textDecoration: 'none', color: 'inherit' }}>
                        ← Volver al inicio
                    </Link>
                </div>
            </header>

            {/* Specialty main layout container */}
            <section style={{ padding: 'clamp(2.5rem, 5vw, 5rem) 0' }}>
                <div className="wrap grid-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'start' }}>

                    {/* Left Column: Specialty info */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div>
                            <span className="eyebrow" style={{ color: 'var(--rojo)', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', fontSize: '0.75rem', marginBottom: '0.5rem', display: 'block' }}>
                                Especialidad Clínica
                            </span>
                            <h1 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', color: 'var(--azul-osc)', margin: '0 0 1rem 0', fontWeight: 'normal', lineHeight: 1.15 }}>
                                {spec.title}
                            </h1>
                            <div className="price-tag" style={{ display: 'inline-block', backgroundColor: 'rgba(217, 56, 68, 0.07)', color: 'var(--rojo-osc)', padding: '0.4rem 1rem', borderRadius: '99px', fontSize: '1rem', fontWeight: 600 }}>
                                Precio orientativo: {spec.price}
                            </div>
                        </div>

                        <div>
                            <h2 style={{ fontFamily: 'var(--font-fraunces)', fontSize: '1.4rem', color: 'var(--azul-osc)', marginBottom: '0.8rem', fontWeight: 'normal' }}>
                                ¿En qué consiste?
                            </h2>
                            <p style={{ color: 'var(--tinta)', lineHeight: 1.7, fontSize: '1rem', margin: 0 }}>
                                {spec.description}
                            </p>
                        </div>

                        {/* Cases list */}
                        <div style={{ backgroundColor: '#fff', border: '1px solid var(--linea)', padding: '2rem', borderRadius: '1.2rem', boxShadow: 'var(--shadow-card)' }}>
                            <h3 style={{ fontFamily: 'var(--font-fraunces)', fontSize: '1.25rem', color: 'var(--azul-osc)', marginTop: 0, marginBottom: '1.2rem', fontWeight: 'normal' }}>
                                Casos médicos a los que aplica:
                            </h3>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                                {spec.cases.map((c, i) => (
                                    <li key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', fontSize: '0.95rem', color: 'var(--tinta-suave)', lineHeight: 1.5 }}>
                                        <span style={{ color: 'var(--rojo)', fontWeight: 'bold', fontSize: '1.1rem', lineHeight: 1 }}>✓</span>
                                        <span>{c}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>


                    </div>

                    {/* Right Column: Doctor detail card */}
                    <div className="doctor-card" style={{ backgroundColor: '#fff', border: '1px solid var(--linea)', borderRadius: '1.2rem', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-big)' }}>
                        <div className="doctor-photo" style={{ width: '100%', aspectRatio: '4/3', overflow: 'hidden', position: 'relative', backgroundColor: '#e2e8f0' }}>
                            <img
                                src={doc.image}
                                alt={`Retrato profesional del ${doc.name}`}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>

                        <div className="doctor-body" style={{ padding: '2.2rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <span style={{ color: 'var(--rojo)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', fontSize: '0.72rem', display: 'block', marginBottom: '0.4rem' }}>
                                    Especialista Asignado
                                </span>
                                <h2 style={{ fontFamily: 'var(--font-fraunces)', fontSize: '1.8rem', color: 'var(--azul-osc)', margin: '0 0 0.25rem 0', fontWeight: 'normal' }}>
                                    {doc.name}
                                </h2>
                                <p style={{ color: 'var(--tinta-suave)', fontSize: '0.9rem', fontWeight: 500, margin: 0 }}>
                                    {doc.role}
                                </p>
                            </div>

                            <div>
                                <h3 style={{ fontFamily: 'var(--font-fraunces)', fontSize: '1.15rem', color: 'var(--azul-osc)', margin: '0 0 0.6rem 0', fontWeight: 'normal' }}>
                                    Biografía
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                    {doc.biography.split('\n\n').map((paragraph, index) => (
                                        <p key={index} style={{ color: 'var(--tinta)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 style={{ fontFamily: 'var(--font-fraunces)', fontSize: '1.15rem', color: 'var(--azul-osc)', margin: '0 0 0.8rem 0', fontWeight: 'normal' }}>
                                    Formación Académica
                                </h3>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                    {doc.education.map((edu, index) => (
                                        <li key={index} style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start', fontSize: '0.88rem', color: 'var(--tinta-suave)', lineHeight: 1.4 }}>
                                            <span style={{ color: 'var(--azul)', fontSize: '1rem', lineHeight: 1 }}>•</span>
                                            <span>{edu}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {doc.registrationNumber && (
                                <div style={{ borderTop: '1px solid var(--linea)', paddingTop: '1rem', fontSize: '0.78rem', color: 'var(--tinta-suave)' }}>
                                    Nº Colegiado: {doc.registrationNumber}
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </section>
        </main>
    );
}
