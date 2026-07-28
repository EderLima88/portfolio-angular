import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Certificado } from '../../core/services/perfil.service';

@Component({
  selector: 'app-certificados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './certificados.html',
  styleUrls: ['./certificados.css']
})
export class CertificadosComponent {
  @Input() listaCertificados: Certificado[] = [];
}
