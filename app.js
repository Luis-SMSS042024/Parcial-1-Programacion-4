class CitasMedicasPanel extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.citas = [];

        this.shadowRoot.innerHTML = `
            <style>
                ${this.obtenerEstilos()}
            </style>
            <div>
                <form class="form-cita" id="formCita">
                    <div>
                        <label for="nombre">Nombre del paciente *</label>
                        <input type="text" id="nombre" name="nombre" placeholder="Ej: Ana López">
                    </div>
                    <div>
                        <label for="dui">DUI *</label>
                        <input type="text" id="dui" name="dui" maxlength="10" placeholder="00000000-0">
                    </div>
                    <div>
                        <label for="especialidad">Especialidad *</label>
                        <select id="especialidad" name="especialidad">
                            <option value="">Seleccione una opción</option>
                            <option value="Medicina General">Medicina General</option>
                            <option value="Pediatría">Pediatría</option>
                            <option value="Odontología">Odontología</option>
                            <option value="Ginecología">Ginecología</option>
                        </select>
                    </div>
                    <div>
                        <label for="fecha">Fecha *</label>
                        <input type="date" id="fecha" name="fecha">
                    </div>
                    <div class="col-span-2">
                        <label for="hora">Hora *</label>
                        <input type="time" id="hora" name="hora">
                    </div>
                </form>

                <div class="mensaje-error" id="errores"></div>

                <div class="botones">
                    <button class="btn" id="btnAgregar">Agregar cita</button>
                    <button class="btn btn-secundario" id="btnLimpiar">Limpiar formulario</button>
                </div>

                <p><strong>Total de citas:</strong> 
                    <span class="badge" id="totalCitas">0</span>
                </p>

                <table class="tabla-citas" aria-label="Listado de citas">
                    <thead>
                        <tr>
                            <th>Paciente</th>
                            <th>DUI</th>
                            <th>Especialidad</th>
                            <th>Fecha</th>
                            <th>Hora</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody id="bodyCitas">
                        <!-- filas dinámicas -->
                    </tbody>
                </table>
            </div>
        `;
    }

    connectedCallback() {
        const btnAgregar = this.shadowRoot.getElementById('btnAgregar');
        const btnLimpiar = this.shadowRoot.getElementById('btnLimpiar');
        const duiInput  = this.shadowRoot.getElementById('dui');

        btnAgregar.addEventListener('click', (e) => {
            e.preventDefault();
            this.agregarCita();
        });

        btnLimpiar.addEventListener('click', (e) => {
            e.preventDefault();
            this.limpiarFormulario();
        });

        // Formato automático del DUI: 00000000-0 (máximo 9 dígitos)
        duiInput.addEventListener('input', (e) => {
            let valor = e.target.value.replace(/[^0-9]/g, '');
            if (valor.length > 9) {
                valor = valor.slice(0, 9);
            }
            if (valor.length > 8) {
                valor = valor.slice(0, 8) + '-' + valor.slice(8);
            }
            e.target.value = valor;
        });
    }

    obtenerEstilos() {
        // Estilos internos del componente (coherentes con style.css)
        return `
            .form-cita { display:grid; grid-template-columns:1fr 1fr; gap:12px 18px; margin-bottom:16px; }
            .form-cita label { font-size:0.85rem; color:#334155; display:block; margin-bottom:4px; }
            .form-cita input, .form-cita select { width:100%; padding:8px 10px; border-radius:8px; border:1px solid #cbd5f5; font-size:0.9rem; }
            .form-cita input:focus, .form-cita select:focus { outline:none; border-color:#2563eb; }
            .form-cita .col-span-2 { grid-column: span 2; }

            .botones { display:flex; gap:10px; margin-bottom:16px; }
            .btn { padding:8px 14px; border-radius:8px; border:none; cursor:pointer; font-size:0.9rem; font-weight:600; color:#ffffff; background-color:#2563eb; }
            .btn-secundario { background-color:#64748b; }
            .btn:hover { opacity:.92; }

            .mensaje-error { color:#b91c1c; font-size:0.8rem; margin-bottom:6px; min-height:16px; }

            .tabla-citas { width:100%; border-collapse:collapse; margin-top:6px; font-size:0.85rem; }
            .tabla-citas th, .tabla-citas td { border-bottom:1px solid #e2e8f0; padding:6px 8px; text-align:left; }
            .tabla-citas th { background-color:#e5edff; color:#1e293b; }

            .badge { display:inline-block; padding:2px 8px; border-radius:999px; font-size:0.75rem; background-color:#dbeafe; color:#1d4ed8; }

            .btn-eliminar { padding:4px 8px; border-radius:6px; border:none; background:#dc2626; color:white; font-size:0.75rem; cursor:pointer; }
        `;
    }

    leerCampos() {
        const get = (id) => this.shadowRoot.getElementById(id).value.trim();

        return {
            nombre: get('nombre'),
            dui: get('dui'),
            especialidad: get('especialidad'),
            fecha: get('fecha'),
            hora: get('hora'),
        };
    }

    validar(datos) {
        const errores = [];

        if (!datos.nombre) {
            errores.push('El nombre del paciente es obligatorio.');
        }

        if (!datos.dui || !/^[0-9]{8}-[0-9]$/.test(datos.dui)) {
            errores.push('El DUI es obligatorio y debe tener formato 00000000-0.');
        }

        if (!datos.especialidad) {
            errores.push('Debe seleccionar una especialidad.');
        }

        if (!datos.fecha) {
            errores.push('La fecha es obligatoria.');
        }

        if (!datos.hora) {
            errores.push('La hora es obligatoria.');
        }

        return errores;
    }

    agregarCita() {
        const datos = this.leerCampos();
        const errores = this.validar(datos);
        const divErrores = this.shadowRoot.getElementById('errores');

        if (errores.length > 0) {
            divErrores.textContent = errores.join(' ');
            return;
        }

        divErrores.textContent = '';

        this.citas.push(datos);
        this.actualizarTabla();
        this.limpiarFormulario(false);
    }

    limpiarFormulario(resetErrores = true) {
        ['nombre', 'dui', 'especialidad', 'fecha', 'hora'].forEach(id => {
            this.shadowRoot.getElementById(id).value = '';
        });

        if (resetErrores) {
            this.shadowRoot.getElementById('errores').textContent = '';
        }
    }

    eliminarCita(indice) {
        this.citas.splice(indice, 1);
        this.actualizarTabla();
    }

    actualizarTabla() {
        const tbody = this.shadowRoot.getElementById('bodyCitas');
        const totalSpan = this.shadowRoot.getElementById('totalCitas');
        tbody.innerHTML = '';

        this.citas.forEach((cita, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${cita.nombre}</td>
                <td>${cita.dui}</td>
                <td>${cita.especialidad}</td>
                <td>${cita.fecha}</td>
                <td>${cita.hora}</td>
                <td><button class="btn-eliminar" data-index="${index}">Cancelar</button></td>
            `;
            tbody.appendChild(tr);
        });

        totalSpan.textContent = this.citas.length.toString();

        tbody.querySelectorAll('.btn-eliminar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const i = parseInt(e.target.getAttribute('data-index'), 10);
                this.eliminarCita(i);
            });
        });
    }
}

customElements.define('citas-medicas-panel', CitasMedicasPanel);
