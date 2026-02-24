Situación Problemática

En clínicas y consultorios médicos pequeños de El Salvador, la gestión de citas médicas se realiza manualmente utilizando libretas o agendas físicas. Esto genera múltiples inconvenientes como citas duplicadas en el mismo horario, olvidos de pacientes, pérdida de información cuando se extravían las agendas físicas, y dificultad para consultar el historial de citas anteriores. Los médicos pierden tiempo buscando espacios disponibles y los pacientes enfrentan largas esperas sin conocer su turno exacto. La solución propuesta es el sistema web "Gestor de Citas Médicas" enfocado al sector salud, específicamente clínicas pequeñas, consultorios médicos privados y centros de salud comunitarios.


PREGUNTAS
¿Qué valor agregado tiene el uso de webcomponents a su proyecto?

El uso de WebComponents proporciona encapsulación completa del sistema de citas médicas mediante el elemento personalizado citas-medicas-panel. Esto garantiza que los estilos CSS estén aislados del resto de la página mediante Shadow DOM, evitando conflictos de especificidad. Permite reutilización total del componente en múltiples páginas sin duplicar código. La lógica JavaScript queda contenida y es independiente de frameworks externos, manteniendo compatibilidad con Vanilla JS, React, Vue u otros. Facilita el mantenimiento al centralizar toda la funcionalidad en un solo componente auto-contenido.

¿De qué forma manipularon los datos sin recargar la página?

La manipulación de datos se realiza completamente en memoria del navegador utilizando DOM manipulation nativa. Los datos de las citas se almacenan en un array this.citas dentro del WebComponent. Al agregar una cita, se ejecuta this.actualizarTabla que regenera dinámicamente el contenido del tbody de la tabla mediante innerHTML y configura eventos delegados para los botones de eliminar. Al cancelar citas, se usa this.citas.splice(indice, 1) seguido de re-renderizado. El contador de total de citas se actualiza con textContent. No se realizan peticiones HTTP ni recargas de página.

¿De qué forma validaron las entradas de datos? Expliquen brevemente

Se implementaron validaciones exhaustivas antes de procesar cualquier cita: Nombre del paciente campo requerido no puede estar vacío. DUI regex valida formato exacto 00000000-0 con input restringido a números máximo 9 dígitos y guion automático. Especialidad campo select requerido opción vacía por defecto. Fecha y Hora campos requeridos tipo date y time. Los errores se muestran en tiempo real en un div id errores con mensajes específicos. El formulario solo procesa datos válidos.

¿Cómo manejará la escalabilidad futura en su página?

Para escalabilidad futura se contemplan las siguientes mejoras: Persistencia de datos migración del array this.citas a localStorage o API REST. Múltiples médicos filtros por doctor y agendas separadas. Notificaciones integración Web Push API para recordatorios automáticos. Paginación implementación slice para tablas con cientos de citas. Modularización división en WebComponents especializados cita-form cita-table cita-filter. Backend migración a Firebase o Node.js Express para multi-usuario y sincronización. Responsive mejoras para tablets y dispositivos móviles.
