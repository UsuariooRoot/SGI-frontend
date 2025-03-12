import { Component, inject } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MtxSelectModule } from '@ng-matero/extensions/select';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    FormlyModule,
    MtxSelectModule,
    MatFormFieldModule,
  ],
})
export class CreateComponent {
  private readonly toast = inject(ToastrService);

  incidentsList: any[] = [];
  selectedIncident: any = null;

  incidentsData: [string, string[]][] = [
    ["Errores de Software", [
      "Error en aplicación interna",
      "Bug en nueva funcionalidad",
      "Fallo en integración de APIs",
      "Problemas con base de datos",
      "Tiempo de respuesta lento en aplicación",
      "Problemas en despliegue de software"
    ]],
    ["Problemas con Servidores y Sistemas", [
      "Fallo en servidor",
      "Espacio insuficiente en disco",
      "Problemas con máquinas virtuales",
      "Errores en sistema operativo",
      "Falla en autenticación de usuario",
      "Cuentas de usuario bloqueadas",
      "Actualización de software requerida"
    ]],
    ["Soporte a Usuarios", [
      "Problema con impresoras",
      "Fallo en acceso a correo electrónico",
      "Error en software de ofimática",
      "Reinicio inesperado de equipo",
      "Problema con credenciales de usuario",
      "No funciona acceso remoto",
      "Solicitud de instalación de software"
    ]],
    ["Redes y Conectividad", [
      "Fallo en conexión a internet",
      "Pérdida de paquetes en red",
      "Problemas con VPN",
      "Desempeño bajo en red interna",
      "Acceso denegado a recursos compartidos",
      "Caída de switch o router",
      "Solicitud de nueva conexión de red"
    ]]
  ]


  form = new FormGroup({});
  model = { email: 'email@gmail.com' };


  submit() {
    if (this.form.valid) {
      this.showToast(this.model);
    }
  }

  showToast(obj: any) {
    this.toast.success(JSON.stringify(obj));
  }

  ngOnInit() {
    this.transformIncidentsData();
  }

  transformIncidentsData() {
    this.incidentsData.forEach(([category, incidents]) => {
      incidents.forEach((incident, index) => {
        this.incidentsList.push({ id: `${category}-${index}`, name: incident, category });
      });
    });
  }
}
