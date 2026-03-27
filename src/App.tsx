/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Heart, Calendar, Clock, Video, Gift, CheckCircle2, X } from 'lucide-react';

// ============================================================================
// CONFIGURACIÓN DEL WEBHOOK
// ============================================================================
// Pega aquí la URL que obtienes al implementar el Google Apps Script
const GOOGLE_SCRIPT_WEBHOOK_URL = ""; 

// ============================================================================
// DATOS DE LOS REGALOS
// ============================================================================
const INITIAL_GIFTS = [
  { id: 'g1', name: 'Peluche de Perrito', description: 'Un compañero suave y tierno para sus aventuras.', image: 'https://images.unsplash.com/photo-1559418068-829471406f31?auto=format&fit=crop&q=80&w=600&h=400' },
  { id: 'g2', name: 'Peluche de Gatito', description: 'Para que tenga dulces sueños acompañados.', image: 'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?auto=format&fit=crop&q=80&w=600&h=400' },
  { id: 'g3', name: 'Set de Moños y Pinzas', description: 'Accesorios coloridos para sus peinados diarios.', image: 'https://images.unsplash.com/photo-1596900769744-2bdc40d807e3?auto=format&fit=crop&q=80&w=600&h=400' },
  { id: 'g4', name: 'Colección de Cuentos', description: 'Historias mágicas para leer antes de dormir.', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600&h=400' },
  { id: 'g5', name: 'Vestido Floral', description: 'Ropa cómoda y alegre para salir a pasear.', image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&q=80&w=600&h=400' },
  { id: 'g6', name: 'Kit de Higiene Dental', description: 'Cepillo divertido y crema para cuidar su sonrisa.', image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=600&h=400' },
  { id: 'g7', name: 'Juguete Didáctico', description: 'Juego de madera para aprender y divertirse.', image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&q=80&w=600&h=400' },
  { id: 'g8', name: 'Pijama Suave', description: 'Para noches cálidas y descansos profundos.', image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&q=80&w=600&h=400' },
  { id: 'g9', name: 'Set de Arte', description: 'Crayones, colores y papel para despertar su creatividad.', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=600&h=400' },
  { id: 'g10', name: 'Zapatos Cómodos', description: 'Para dar pasos firmes en esta nueva etapa.', image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&q=80&w=600&h=400' },
  { id: 'g11', name: 'Juguetes para el Baño', description: 'Patitos y juegos de agua para la hora de bañarse.', image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=600&h=400' },
  { id: 'g12', name: 'Toalla con Capucha', description: 'Para secarla y mantenerla calientita después del baño.', image: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&q=80&w=600&h=400' },
  { id: 'g13', name: 'Vasos de Transición', description: 'Vasitos entrenadores para que aprenda a tomar solita.', image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=600&h=400' },
  { id: 'g14', name: 'Platos y Cubiertos', description: 'Set de alimentación seguro y divertido.', image: 'https://images.unsplash.com/photo-1581836499506-4a660b39478a?auto=format&fit=crop&q=80&w=600&h=400' },
  { id: 'g15', name: 'Silla de Comer', description: 'Para que comparta la mesa con nosotros.', image: 'https://images.unsplash.com/photo-1540479859555-17af45c78602?auto=format&fit=crop&q=80&w=600&h=400' },
  { id: 'g16', name: 'Lámpara de Noche', description: 'Luz suave para acompañar sus sueños.', image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=600&h=400' },
  { id: 'g17', name: 'Organizador de Juguetes', description: 'Para mantener su nuevo cuarto ordenado.', image: 'https://images.unsplash.com/photo-1595514535315-2a0b1fd0c62e?auto=format&fit=crop&q=80&w=600&h=400' },
  { id: 'g18', name: 'Ropa de Cama Infantil', description: 'Sábanas suaves con diseños divertidos.', image: 'https://images.unsplash.com/photo-1522771730848-ba152f214b12?auto=format&fit=crop&q=80&w=600&h=400' },
  { id: 'g19', name: 'Mochila Pequeña', description: 'Para llevar sus tesoros cuando salgamos de paseo.', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600&h=400' },
  { id: 'g20', name: 'Álbum de Fotos', description: 'Para guardar los recuerdos de esta nueva familia.', image: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&q=80&w=600&h=400' },
];

const GALLERY_IMAGES = Array.from({ length: 15 }).map((_, i) => `https://picsum.photos/seed/evelynfamily${i + 1}/600/600`);

export default function App() {
  // ============================================================================
  // ESTADOS
  // ============================================================================
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [gifts, setGifts] = useState(INITIAL_GIFTS);
  const [reservedGiftIds, setReservedGiftIds] = useState<string[]>([]);
  
  // Modal states
  const [selectedGift, setSelectedGift] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // ============================================================================
  // LÓGICA DEL CONTADOR REGRESIVO
  // ============================================================================
  useEffect(() => {
    // Fecha de la fiesta: 24 de Febrero (ajusta el año según corresponda)
    const partyDate = new Date('February 24, 2027 18:15:00').getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = partyDate - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // ============================================================================
  // LÓGICA DE RESERVA
  // ============================================================================
  const openReservationModal = (gift: any) => {
    setSelectedGift(gift);
    setIsModalOpen(true);
    setShowSuccessMessage(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setGuestName('');
      setGuestPhone('');
      setSelectedGift(null);
      setShowSuccessMessage(false);
    }, 300);
  };

  const handleReserve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !guestPhone || !selectedGift) return;

    setIsSubmitting(true);

    const payload = {
      giftId: selectedGift.id,
      giftName: selectedGift.name,
      guestName: guestName,
      guestPhone: guestPhone
    };

    try {
      if (GOOGLE_SCRIPT_WEBHOOK_URL) {
        // Enviar datos al webhook de Google Apps Script
        // Usamos text/plain para evitar el preflight CORS de OPTIONS que a veces falla en GAS
        const response = await fetch(GOOGLE_SCRIPT_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          },
          body: JSON.stringify(payload)
        });
        
        const result = await response.json();
        console.log('Respuesta del servidor:', result);
      } else {
        // Simulación si no hay URL configurada
        console.warn("No hay URL de Webhook configurada. Simulando éxito...");
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      // Éxito: Actualizar UI
      setReservedGiftIds(prev => [...prev, selectedGift.id]);
      setShowSuccessMessage(true);
      
      // Cerrar modal después de mostrar el mensaje de éxito
      setTimeout(() => {
        closeModal();
      }, 3000);

    } catch (error) {
      console.error('Error al reservar:', error);
      alert('Hubo un error al procesar tu reserva. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* =========================================================================
          SECCIÓN 1: HÉROE (PORTADA)
          ========================================================================= */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=2000')",
          }}
        >
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px]"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center justify-center p-3 bg-pastel-pink rounded-full mb-6 shadow-sm">
            <Heart className="w-8 h-8 text-pink-500 fill-pink-500" />
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold text-gray-800 mb-4 drop-shadow-sm">
            ¡Bienvenida, Evelyn!
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 mb-12 font-light">
            Nuestra dulce espera de 3 años terminó
          </p>

          {/* Contador Regresivo */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-xl border border-white/50">
            <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-6 font-semibold">Faltan para celebrar</h3>
            <div className="flex gap-4 md:gap-8 justify-center">
              {[
                { label: 'Días', value: timeLeft.days },
                { label: 'Horas', value: timeLeft.hours },
                { label: 'Minutos', value: timeLeft.minutes },
                { label: 'Segundos', value: timeLeft.seconds }
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="w-16 h-16 md:w-24 md:h-24 bg-pastel-mint rounded-2xl flex items-center justify-center shadow-inner mb-2">
                    <span className="text-3xl md:text-5xl font-script text-teal-800">{item.value}</span>
                  </div>
                  <span className="text-xs md:text-sm text-gray-600 font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
          
          <a href="#regalos" className="mt-12 animate-bounce p-2 bg-white rounded-full shadow-md text-gray-400 hover:text-pink-500 transition-colors">
            <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </a>
        </div>
      </section>

      {/* =========================================================================
          SECCIÓN 2: NUESTRA HISTORIA
          ========================================================================= */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl text-soft-gold mb-8">Nuestra Historia</h2>
          <div className="prose prose-lg mx-auto text-gray-600 leading-relaxed">
            <p className="mb-6">
              Hace tres años comenzamos un viaje lleno de esperanza, papeleos, entrevistas y, sobre todo, mucho amor acumulado. A través del ICBF, decidimos abrir nuestro corazón y nuestro hogar.
            </p>
            <p className="mb-6">
              Hubo días largos y noches de incertidumbre, pero cada paso valió la pena. Hoy, el sueño se ha hecho realidad. Evelyn ya está con nosotros, llenando la casa de nuevas risas, colores y aventuras.
            </p>
            <p>
              Su hermana mayor, Luciana, está emocionada de enseñarle el mundo, y nosotros no podríamos estar más felices de presentarles oficialmente a la nueva integrante de nuestra familia.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECCIÓN 3: LA FIESTA (DETALLES)
          ========================================================================= */}
      <section className="py-16 px-4 bg-pastel-pink/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl text-center text-gray-800 mb-12">Acompáñanos a Celebrar</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm text-center flex flex-col items-center transform transition hover:-translate-y-1">
              <div className="w-16 h-16 bg-pastel-pink rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Fecha</h3>
              <p className="text-gray-600">Martes<br/>24 de Febrero</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm text-center flex flex-col items-center transform transition hover:-translate-y-1">
              <div className="w-16 h-16 bg-pastel-mint rounded-full flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Hora</h3>
              <p className="text-gray-600">6:15 PM<br/>(Hora Colombia)</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm text-center flex flex-col items-center transform transition hover:-translate-y-1">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <Video className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Lugar</h3>
              <p className="text-gray-600 mb-4">Plataforma Zoom</p>
              <button className="px-6 py-2 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 transition-colors shadow-md">
                Unirse a la llamada
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECCIÓN 4: LISTA DE REGALOS
          ========================================================================= */}
      <section id="regalos" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl text-gray-800 mb-4">Lista de Regalos</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Tu presencia (virtual) es nuestro mayor regalo. Sin embargo, si deseas tener un detalle con Evelyn en esta nueva etapa, hemos preparado algunas sugerencias de cositas que le encantarán y le serán muy útiles.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {gifts.map((gift) => {
              const isReserved = reservedGiftIds.includes(gift.id);
              
              return (
                <div key={gift.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row items-center">
                  <div className="w-full sm:w-48 h-48 sm:h-32 overflow-hidden relative flex-shrink-0">
                    <img 
                      src={gift.image} 
                      alt={gift.name} 
                      className={`w-full h-full object-cover transition-transform duration-500 hover:scale-110 ${isReserved ? 'grayscale opacity-60' : ''}`}
                      referrerPolicy="no-referrer"
                    />
                    {isReserved && (
                      <div className="absolute inset-0 bg-white/40 flex items-center justify-center backdrop-blur-[1px]">
                        <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Reservado
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-grow w-full text-center sm:text-left">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{gift.name}</h3>
                    <p className="text-sm text-gray-500">{gift.description}</p>
                  </div>
                  <div className="p-5 w-full sm:w-auto flex-shrink-0 border-t sm:border-t-0 sm:border-l border-gray-100 flex items-center justify-center">
                    <button 
                      onClick={() => openReservationModal(gift)}
                      disabled={isReserved}
                      className={`w-full sm:w-48 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                        isReserved 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-pastel-pink text-pink-800 hover:bg-pink-200 shadow-sm'
                      }`}
                    >
                      {isReserved ? 'Ya Reservado' : 'Reservar Regalo'}
                      {!isReserved && <Gift className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECCIÓN 5: GALERÍA DE FOTOS
          ========================================================================= */}
      <section className="py-20 px-4 bg-pastel-pink/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl text-gray-800 mb-4">Nuestros Momentos</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Un pequeño vistazo a la alegría que ha traído Evelyn a nuestras vidas.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {GALLERY_IMAGES.map((src, index) => (
              <div key={index} className="aspect-square rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                <img src={src} alt={`Momento ${index + 1}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          FOOTER
          ========================================================================= */}
      <footer className="bg-gray-50 py-12 text-center mt-auto border-t border-gray-100">
        <div className="max-w-2xl mx-auto px-4">
          <Heart className="w-6 h-6 text-pink-400 mx-auto mb-4" />
          <p className="text-xl font-script text-gray-600 mb-2">Con todo nuestro amor y gratitud,</p>
          <p className="text-gray-800 font-medium">Leandro, Carolina, Luciana y nuestra hija Evelyn</p>
        </div>
      </footer>

      {/* =========================================================================
          MODAL DE RESERVA
          ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div 
            className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div className="relative h-32 bg-pastel-mint flex items-center justify-center">
              <button 
                onClick={closeModal}
                className="absolute top-4 right-4 p-2 bg-white/50 hover:bg-white rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-teal-800" />
              </button>
              <Gift className="w-12 h-12 text-teal-700" />
            </div>

            {/* Body Modal */}
            <div className="p-6 md:p-8">
              {showSuccessMessage ? (
                <div className="text-center py-8 animate-in fade-in zoom-in duration-300">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-script text-gray-800 mb-2">¡Gracias por tu regalo!</h3>
                  <p className="text-gray-600">
                    Hemos registrado tu reserva para <strong>{selectedGift?.name}</strong>. Evelyn estará muy feliz.
                  </p>
                </div>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-script text-gray-800 mb-1">Reservar Regalo</h3>
                    <p className="text-gray-600 font-medium">{selectedGift?.name}</p>
                  </div>

                  <form onSubmit={handleReserve} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pastel-mint focus:border-teal-500 outline-none transition-all"
                        placeholder="Ej. María Pérez"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Teléfono de Contacto *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        required
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pastel-mint focus:border-teal-500 outline-none transition-all"
                        placeholder="Ej. 300 123 4567"
                      />
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-3 rounded-xl font-medium text-white shadow-md transition-all flex items-center justify-center gap-2 ${
                          isSubmitting 
                            ? 'bg-teal-400 cursor-wait' 
                            : 'bg-teal-600 hover:bg-teal-700'
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Procesando...
                          </>
                        ) : (
                          'Confirmar Reserva'
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
