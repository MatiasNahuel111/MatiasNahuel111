        console.log("[DEBUG] Inicio del bloque <script>");

        // --- Variables Globales y Datos Simulados ---
        let pedidosEmpaquetadosHoyCount = 0;
        window.pedidosDataGlobal = {};
        window.preguntasDataGlobal = [
            { id: "PREG1", itemId: "MLA123", texto: "¿Tienen stock en color azul para el SuperPhone X?", fecha: new Date(Date.now() - 86400000 * 1).toISOString(), unread: true, respondida: false, producto: { nombre: "SuperPhone X - Azul Galaxia", imagen: "https://via.placeholder.com/60/00F/FFF?Text=SPX" } },
            { id: "PREG2", itemId: "MLA456", texto: "¿Hacen envíos a Tierra del Fuego para la Tablet GenPad 5?", fecha: new Date(Date.now() - 86400000 * 2).toISOString(), unread: false, respondida: true, respuesta: "Sí, hacemos envíos a todo el país a través de Mercado Envíos.", producto: { nombre: "Tablet GenPad 5 - Gris Espacial", imagen: "https://via.placeholder.com/60/888/FFF?Text=GP5" } },
            { id: "PREG3", itemId: "MLA789", texto: "¿Cuál es la garantía de los Auriculares SonicBlast? ¿Cubre caídas?", fecha: new Date(Date.now() - 3600000 * 5).toISOString(), unread: true, respondida: false, producto: { nombre: "Auriculares SonicBlast - Negro Mate", imagen: "https://via.placeholder.com/60/222/FFF?Text=SB" } }
        ];
        window.conversacionesDataGlobal = [
            { id: "CONV1", pedidoId: "MELIORDER-FLEX1", clienteNombre: "Juan Flex", ultimoMensaje: "¡Muchas gracias por la rápida respuesta!", fechaUltimoMensaje: new Date(Date.now() - 3600000 * 2).toISOString(), unread: true, mensajes: [ { texto: "¿Podrían confirmar si mi pedido ya fue preparado?", emisor: "cliente", fecha: new Date(Date.now() - 3600000 * 2.5).toISOString()}, { texto: "Hola Juan! Sí, tu pedido MELIORDER-FLEX1 ya está listo para ser despachado con Flex hoy mismo.", emisor: "vendedor", fecha: new Date(Date.now() - 3600000 * 2.2).toISOString() }, { texto: "¡Muchas gracias por la rápida respuesta!", emisor: "cliente", fecha: new Date(Date.now() - 3600000 * 2).toISOString()} ] },
            { id: "CONV2", pedidoId: "MELIORDER-CORREO1", clienteNombre: "Maria Correo", ultimoMensaje: "Ok, aguardo el código de seguimiento. Saludos.", fechaUltimoMensaje: new Date(Date.now() - 86400000 * 1.5).toISOString(), unread: false, mensajes: [ { texto: "Buenas tardes, realicé una compra ayer, ¿cuándo lo despachan?", emisor: "cliente", fecha: new Date(Date.now() - 86400000 * 1.7).toISOString() }, { texto: "Hola Maria, tu pedido MELIORDER-CORREO1 se despacha hoy por la tarde. Te llegará el código de seguimiento automáticamente. Saludos!", emisor: "vendedor", fecha: new Date(Date.now() - 86400000 * 1.6).toISOString() }, { texto: "Ok, aguardo el código de seguimiento. Saludos.", emisor: "cliente", fecha: new Date(Date.now() - 86400000 * 1.5).toISOString() } ] }
        ];
        window.historialPedidosGlobal = {};
        window.devolucionesDataGlobal = [];
        window.empaquetadoresDisponibles = [];
        window.empaquetadorActivo = null;

        window.pedidosCanceladosPorMLSimulado = ['MELIORDER-FLEX1', 'ID-PEDIDO-QUE-NO-EXISTE']; 

        const plantillasRespuesta = [
            { id: "saludo_stock", titulo: "Saludo + Hay Stock", texto: "¡Hola! Gracias por tu consulta. Sí, tenemos stock disponible para entrega inmediata. ¡Esperamos tu compra! Saludos." },
            { id: "despedida_stock", titulo: "Consulta Stock + Despedida", texto: "¡Hola! Sí, tenemos stock. Cualquier otra duda, avísanos. ¡Saludos!"},
            { id: "agradecimiento_compra", titulo: "Agradecimiento Post-Venta", texto: "¡Hola! Muchas gracias por tu compra. Estamos preparando tu pedido y te avisaremos cuando sea despachado. Saludos." },
            { id: "info_envio", titulo: "Info Envío Estándar", texto: "¡Hola! Tu pedido será despachado en las próximas 24hs hábiles. Recibirás el código de seguimiento por este medio y por email. Saludos."},
            { id: "respuesta_generica", titulo: "Respuesta Genérica", texto: "¡Hola! Gracias por comunicarte. Estamos revisando tu consulta y te responderemos a la brevedad. Saludos."}
        ];
        const MOTIVOS_DEVOLUCION = ["No me gustó/No era lo que esperaba", "Talle/Color incorrecto", "Producto defectuoso", "Me arrepentí de la compra", "Dañado en el envío"];
        const ESTADOS_DEVOLUCION = [
            "Iniciada", "En tránsito al vendedor", "Recibida por el vendedor", "Inspección completada",
            "Procesada (Stock Reingresado)", "Procesada (Items Descartados)", 
            "Reembolso procesado", "Cerrada", "Cancelada"
        ];
        const pedidosSimuladosBase = [
            {id: 'MELIORDER-TURBO1', cliente: 'Cliente Turbo', itemsCount: 2, tipoEnvio: 'TURBO', esCancelado: false, fechaCancelacion: null, productos: [
                {id_instancia_pedido: 'MELIORDER-TURBO1-1', img: "https://via.placeholder.com/50/FF00FF/000000?Text=PT1", nombre: "Prod Turbo A", sku: "TUR-A", pedida: 1},
                {id_instancia_pedido: 'MELIORDER-TURBO1-2', img: "https://via.placeholder.com/50/FFFF00/000000?Text=PT2", nombre: "Prod Turbo B", sku: "TUR-B", pedida: 1}
            ]},
            {id: 'MELIORDER-FLEX1', cliente: 'Juan Flex', itemsCount: 3, tipoEnvio: 'FLEX', esCancelado: false, fechaCancelacion: null, productos: [
                {id_instancia_pedido: 'MELIORDER-FLEX1-1', img: "https://via.placeholder.com/50/FF0000/FFFFFF?Text=P1", nombre: "Botella Azul", sku: "BT500-AZUL", pedida: 2, ubicacion: "A1-S3", notaProducto: "Revisar tapa"},
                {id_instancia_pedido: 'MELIORDER-FLEX1-2', img: "https://via.placeholder.com/50/00FF00/FFFFFF?Text=P2", nombre: "Taza Gato", sku: "TAZA-CL01", pedida: 1, ubicacion: "B2-S1"}
            ]},
            {id: 'MELIORDER-CORREO1', cliente: 'Maria Correo', itemsCount: 1, tipoEnvio: 'CORREO', esCancelado: false, fechaCancelacion: null, notaInterna: "Revisar dirección de envío antes de imprimir etiqueta.", productos: [
                {id_instancia_pedido: 'MELIORDER-CORREO1-1', img: "https://via.placeholder.com/50/0000FF/FFFFFF?Text=P3", nombre: "Libreta Ecológica", sku: "LIB-ECO-R", pedida: 1, ubicacion: "D1-S2", notaProducto: "Color verde oscuro"}
            ]},
            {id: 'MELIORDER-RETIRO1', cliente: 'Laura Retira', itemsCount: 1, tipoEnvio: 'RETIRO', esCancelado: false, fechaCancelacion: null, notaInterna: "Llama media hora antes. Paga saldo pendiente.", productos: [
                {id_instancia_pedido: 'MELIORDER-RETIRO1-1', img: "https://via.placeholder.com/50/800080/FFFFFF?Text=PR1", nombre: "Producto para Retiro Especial", sku: "PROD-RET-ESP", pedida: 1, ubicacion: "Mostrador Caja", notaProducto: "Preparar en bolsa especial regalo."}
            ]}
        ];

        console.log("[DEBUG] Variables globales definidas.");

        // --- DEFINICIONES DE FUNCIONES ---

        function mostrarSeccion(idSeccion) {
            // console.log("[DEBUG] mostrarSeccion llamada con:", idSeccion);
            const secciones = ['dashboard-wrapper', 'verificacion-actual-wrapper', 'historial-pedidos', 'preguntas-wrapper', 'mensajes-postventa-wrapper', 'configuracion-wrapper', 'devoluciones-wrapper'];
            secciones.forEach(id => { 
                const el = document.getElementById(id); 
                if (el) {
                    el.style.display = 'none';
                } else {
                    console.warn("[DEBUG] mostrarSeccion: No se encontró el div de sección:", id);
                }
            });
           
            const seccionActiva = document.getElementById(idSeccion);
            if (seccionActiva) {
                seccionActiva.style.display = 'block';
            } else { 
                console.error(`[DEBUG] mostrarSeccion: Elemento ${idSeccion} no encontrado.`); 
                return; 
            }
           
            if (idSeccion === 'dashboard-wrapper') { 
                if (typeof actualizarDashboard === 'function') actualizarDashboard(); else console.error("[DEBUG] actualizarDashboard no es una función");
                if (typeof actualizarInfoEmpaquetadorActivoDashboard === 'function') actualizarInfoEmpaquetadorActivoDashboard(); else console.error("[DEBUG] actualizarInfoEmpaquetadorActivoDashboard no es una función");
                if (typeof checkForRecentCancellations === 'function') checkForRecentCancellations(); else console.error("[DEBUG] checkForRecentCancellations no es una función");
            } else if (idSeccion === 'preguntas-wrapper') { 
                if (typeof cargarPreguntasSinResponder === 'function') cargarPreguntasSinResponder(); else console.error("[DEBUG] cargarPreguntasSinResponder no es una función");
                if (typeof popularSelectsPlantillas === 'function') popularSelectsPlantillas(); else console.error("[DEBUG] popularSelectsPlantillas no es una función");
            } else if (idSeccion === 'mensajes-postventa-wrapper') { 
                if (typeof cargarConversacionesPostventa === 'function') cargarConversacionesPostventa(); else console.error("[DEBUG] cargarConversacionesPostventa no es una función");
                if (typeof popularSelectsPlantillas === 'function') popularSelectsPlantillas(); else console.error("[DEBUG] popularSelectsPlantillas no es una función");
            } else if (idSeccion === 'verificacion-actual-wrapper') { 
                const idPedidoActualEl = document.getElementById('id-pedido-actual');
                const verificacionPedidoEl = document.getElementById('verificacion-pedido');
                if (idPedidoActualEl && verificacionPedidoEl) {
                    verificacionPedidoEl.style.display = idPedidoActualEl.textContent ? 'block' : 'none';
                } else {
                    console.warn("[DEBUG] Elementos id-pedido-actual o verificacion-pedido no encontrados en verificacion-actual-wrapper");
                }
            } else if (idSeccion === 'configuracion-wrapper') { 
                if (typeof popularListaEmpaquetadoresUI === 'function') popularListaEmpaquetadoresUI(); else console.error("[DEBUG] popularListaEmpaquetadoresUI no es una función");
            } else if (idSeccion === 'devoluciones-wrapper') { 
                if (typeof cargarVistaDevoluciones === 'function') cargarVistaDevoluciones(); else console.error("[DEBUG] cargarVistaDevoluciones no es una función");
            }
        }
        console.log("[DEBUG] Función mostrarSeccion definida:", typeof mostrarSeccion);
        
        // ... (AQUÍ VAN TODAS TUS OTRAS FUNCIONES: actualizarDashboard, cargarPreguntasSinResponder, etc.)
        // He omitido el cuerpo de las otras funciones para brevedad, pero deben estar aquí en tu código real.
        // Por favor, asegúrate de que todas tus funciones estén definidas antes del listener de DOMContentLoaded.
        // Ejemplo de cómo deberían seguir las demás funciones:
        function actualizarDashboard() { /* ... tu código ... */ }
        function actualizarInfoEmpaquetadorActivoDashboard() { /* ... tu código ... */ }
        function checkForRecentCancellations() { /* ... tu código ... */ }
        function actualizarBadgeNotificaciones(badgeId) { /* ... tu código ... */ }
        function agregarEmpaquetador() { /* ... tu código ... */ }
        function eliminarEmpaquetador(nombreAEliminar) { /* ... tu código ... */ }
        function popularListaEmpaquetadoresUI() { /* ... tu código ... */ }
        function seleccionarEmpaquetadorActivo(nombre) { /* ... tu código ... */ }
        function guardarConfiguracionEmpaquetadores() { /* ... tu código ... */ }
        function cargarConfiguracionEmpaquetadores() { /* ... tu código ... */ }
        function popularListasDePedidosPendientes() { /* ... tu código ... */ }
        function cargarPedido(idPedido) { /* ... tu código ... */ }
        function verificarItemConClick(boton, itemIdInstanciaPedido) { /* ... tu código ... */ }
        function actualizarProgresoGeneral() { /* ... tu código ... */ }
        function guardarNotaInterna() { /* ... tu código ... */ }
        function guardarPedidosDataGlobal() { /* ... tu código ... */ }
        function guardarHistorialPedidosGlobal() { /* ... tu código ... */ }
        function finalizarPedidoActual() { /* ... tu código ... */ }
        function actualizarMensajeListaVacia(listId) { /* ... tu código ... */ }
        function popularSelectsPlantillas() { /* ... tu código ... */ }
        function aplicarPlantilla(selectElement, textareaId) { /* ... tu código ... */ }
        function cargarPreguntasSinResponder() { /* ... tu código ... */ }
        function toggleLeidoPregunta(idPregunta, boton) { /* ... tu código ... */ }
        function responderPregunta(idPregunta) { /* ... tu código ... */ }
        function filtrarListaPreguntas() { /* ... tu código ... */ }
        function cargarConversacionesPostventa() { /* ... tu código ... */ }
        function toggleLeidoConversacion(idConversacion, marcarComoLeido) { /* ... tu código ... */ }
        let conversacionActivaIdModal = null;
        function abrirModalMensajesPostventa(idConversacion) { /* ... tu código ... */ }
        function renderizarMensajesPostventa(idConv, mensajes) { /* ... tu código ... */ }
        function cerrarModalMensajesPostventa() { /* ... tu código ... */ }
        function enviarRespuestaPostventa() { /* ... tu código ... */ }
        function inicializarDatosDevoluciones() { /* ... tu código ... */ }
        function guardarDatosDevoluciones() { /* ... tu código ... */ }
        function cargarVistaDevoluciones() { /* ... tu código ... */ }
        function cambiarEstadoDevolucion(devolucionId, nuevoEstado) { /* ... tu código ... */ }
        function reingresarStockDevolucion(devolucionId) { /* ... tu código ... */ }
        function descartarProductosDevolucion(devolucionId) { /* ... tu código ... */ }
        function sincronizarCancelacionesConML() { /* ... tu código ... */ }
        function cargarHistorial() { /* ... tu código ... */ }
        function verDetallesPedidoHistorial(fecha, idPedido) { /* ... tu código ... */ }
        function mostrarResumenProductosDia() { /* ... tu código ... */ }

        console.log("[DEBUG] Todas las demás funciones (supuestamente) definidas.");

        // --- Inicialización al cargar la página ---
        document.addEventListener('DOMContentLoaded', (event) => {
            console.log("[DEBUG] DOMContentLoaded evento disparado.");
            try {
                const elFechaHistorial = document.getElementById('fecha-historial');
                if (elFechaHistorial) {
                    const today = new Date();
                    elFechaHistorial.value = `${today.getFullYear()}-${('0' + (today.getMonth() + 1)).slice(-2)}-${('0' + today.getDate()).slice(-2)}`;
                } else {
                    console.warn("[DEBUG] Elemento fecha-historial no encontrado en DOMContentLoaded.");
                }
                
                const historialGuardado = localStorage.getItem('historialPedidosGlobal');
                if (historialGuardado) {
                    try {
                        window.historialPedidosGlobal = JSON.parse(historialGuardado);
                    } catch (e) {
                        console.error("[DEBUG] Error parseando historialPedidosGlobal desde localStorage:", e);
                        window.historialPedidosGlobal = {};
                    }
                }
            
                const pedidosGuardadosLocal = localStorage.getItem('pedidosDataGlobal');
                if (pedidosGuardadosLocal) { 
                    try {
                        window.pedidosDataGlobal = JSON.parse(pedidosGuardadosLocal);
                        Object.values(window.pedidosDataGlobal).forEach(p => {
                            if (p.esCancelado === undefined) p.esCancelado = false;
                            if (p.fechaCancelacion === undefined) p.fechaCancelacion = null;
                        });
                    } catch (e) {
                        console.error("[DEBUG] Error parseando pedidosDataGlobal desde localStorage:", e);
                        window.pedidosDataGlobal = {}; //Fallback a objeto vacío
                        // Re-inicializar con datos base si el parseo falla y es la primera carga
                        pedidosSimuladosBase.forEach(p => {
                            p.productos.forEach(prod => prod.verificada = 0); 
                            window.pedidosDataGlobal[p.id] = JSON.parse(JSON.stringify({ 
                                ...p, empaquetado: false, fechaCompletado: null, empaquetadoPor: null, 
                                stockDescontadoConfirmado: false, esCancelado: p.esCancelado || false, 
                                fechaCancelacion: p.fechaCancelacion || null 
                            }));
                        });
                        if (typeof guardarPedidosDataGlobal === 'function') guardarPedidosDataGlobal();
                    }
                } else {
                     pedidosSimuladosBase.forEach(p => {
                        p.productos.forEach(prod => prod.verificada = 0); 
                        window.pedidosDataGlobal[p.id] = JSON.parse(JSON.stringify({ 
                            ...p, empaquetado: false, fechaCompletado: null, empaquetadoPor: null, 
                            stockDescontadoConfirmado: false, esCancelado: p.esCancelado || false, 
                            fechaCancelacion: p.fechaCancelacion || null 
                        }));
                    });
                    if (typeof guardarPedidosDataGlobal === 'function') guardarPedidosDataGlobal();
                }

                if (window.historialPedidosGlobal && typeof window.historialPedidosGlobal === 'object') {
                    for (const fecha in window.historialPedidosGlobal) {
                        if(Array.isArray(window.historialPedidosGlobal[fecha])) {
                            window.historialPedidosGlobal[fecha].forEach(p => {
                                if (p.esCancelado === undefined) p.esCancelado = false;
                                if (p.fechaCancelacion === undefined) p.fechaCancelacion = null;
                            });
                        }
                    }
                }


                if (typeof cargarConfiguracionEmpaquetadores === 'function') cargarConfiguracionEmpaquetadores(); else console.error("[DEBUG] cargarConfiguracionEmpaquetadores no es una función");
                if (typeof inicializarDatosDevoluciones === 'function') inicializarDatosDevoluciones(); else console.error("[DEBUG] inicializarDatosDevoluciones no es una función");
                if (typeof popularListasDePedidosPendientes === 'function') popularListasDePedidosPendientes(); else console.error("[DEBUG] popularListasDePedidosPendientes no es una función");
                if (typeof popularSelectsPlantillas === 'function') popularSelectsPlantillas(); else console.error("[DEBUG] popularSelectsPlantillas no es una función");
                if (typeof cargarPreguntasSinResponder === 'function') cargarPreguntasSinResponder(); else console.error("[DEBUG] cargarPreguntasSinResponder no es una función");
                if (typeof cargarConversacionesPostventa === 'function') cargarConversacionesPostventa(); else console.error("[DEBUG] cargarConversacionesPostventa no es una función");
            
                console.log("[DEBUG] Llamando a mostrarSeccion('dashboard-wrapper') desde DOMContentLoaded.");
                if (typeof mostrarSeccion === 'function') {
                    mostrarSeccion('dashboard-wrapper'); 
                } else {
                    console.error("[DEBUG] ERROR CRÍTICO: mostrarSeccion no es una función al intentar llamarla desde DOMContentLoaded.");
                }
                console.log("[DEBUG] mostrarSeccion llamada desde DOMContentLoaded completada (o intento realizado).");

                const completarEmpaqueBtn = document.getElementById('completar-empaque-btn');
                if (completarEmpaqueBtn && typeof finalizarPedidoActual === 'function') {
                    completarEmpaqueBtn.addEventListener('click', finalizarPedidoActual);
                } else {
                     if(!completarEmpaqueBtn) console.warn("[DEBUG] Botón completar-empaque-btn no encontrado.");
                     if(typeof finalizarPedidoActual !== 'function') console.error("[DEBUG] finalizarPedidoActual no es una función.");
                }

                const filtroPreguntasInput = document.getElementById('filtro-preguntas');
                if (filtroPreguntasInput && typeof filtrarListaPreguntas === 'function') {
                    filtroPreguntasInput.addEventListener('input', filtrarListaPreguntas);
                } else {
                     if(!filtroPreguntasInput) console.warn("[DEBUG] Input filtro-preguntas no encontrado.");
                     if(typeof filtrarListaPreguntas !== 'function') console.error("[DEBUG] filtrarListaPreguntas no es una función.");
                }
                
                const barcodeScannerInput = document.getElementById('barcode-scanner');
                if (barcodeScannerInput) {
                    barcodeScannerInput.addEventListener('keypress', function(e) { 
                         if (e.key === 'Enter') {
                            e.preventDefault();
                            const scannedValue = this.value.trim().toUpperCase();
                            if (scannedValue === "") return;
                            const idPedidoActualEl = document.getElementById('id-pedido-actual');
                            const idPedidoActual = idPedidoActualEl ? idPedidoActualEl.textContent : null;

                            if (!idPedidoActual || !window.pedidosDataGlobal || !window.pedidosDataGlobal[idPedidoActual]) {
                                 alert("No hay pedido activo para escanear productos."); this.value = ''; return;
                            }
                            const pedido = window.pedidosDataGlobal[idPedidoActual];
                            if (!pedido || !Array.isArray(pedido.productos)) {
                                alert("Datos del pedido o productos no encontrados/inválidos."); this.value = ''; return;
                            }
                            const productoEncontrado = pedido.productos.find(p => p.sku && p.sku.toUpperCase() === scannedValue && (p.verificada || 0) < p.pedida);
                            if (productoEncontrado) {
                                const filaProducto = document.querySelector(`#tabla-productos-tbody tr[data-item-id="${productoEncontrado.id_instancia_pedido}"]`);
                                if (filaProducto) {
                                    const botonVerificar = filaProducto.querySelector('button.action-button:not(:disabled)');
                                    if (botonVerificar && typeof verificarItemConClick === 'function') {
                                        verificarItemConClick(botonVerificar, productoEncontrado.id_instancia_pedido);
                                    } else {
                                        console.warn(`[DEBUG] Producto ${productoEncontrado.nombre} (SKU: ${scannedValue}) encontrado, pero su botón de verificación no está activo o no se encontró, o verificarItemConClick no es función.`);
                                        alert(`El producto ${productoEncontrado.nombre} (SKU: ${scannedValue}) ya ha sido completamente verificado o hay un problema con su botón/función de verificación.`);
                                    }
                                } else {
                                     console.error(`[DEBUG] No se encontró la fila para el producto con id_instancia_pedido: ${productoEncontrado.id_instancia_pedido} (SKU: ${scannedValue})`);
                                     alert(`Se encontró el producto con SKU ${scannedValue} pero no su fila en la tabla.`);
                                }
                            } else {
                                alert(`SKU "${scannedValue}" no encontrado en este pedido, o ya ha sido completamente verificado.`);
                            }
                            this.value = ''; this.focus();
                        }
                    });
                } else {
                    console.warn("[DEBUG] Input barcode-scanner no encontrado.");
                }

            } catch (e) {
                console.error("[DEBUG] Error durante la inicialización en DOMContentLoaded:", e.message, e.stack);
            }
            
            console.log("[DEBUG] Sistema de Verificación de Empaques y Gestión ML inicializado (final de DOMContentLoaded).");
        });
        console.log("[DEBUG] Fin del bloque <script>, listener de DOMContentLoaded añadido.");
