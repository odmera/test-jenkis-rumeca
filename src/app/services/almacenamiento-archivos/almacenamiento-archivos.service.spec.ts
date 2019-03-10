import { TestBed, inject } from '@angular/core/testing';
import { AlmacenamientoArchivosService } from './almacenamiento-archivos.service';



describe('UsuarioService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AlmacenamientoArchivosService]
    });
  });

  it('should be created', inject([AlmacenamientoArchivosService], (service: AlmacenamientoArchivosService) => {
    expect(service).toBeTruthy();
  }));
});
