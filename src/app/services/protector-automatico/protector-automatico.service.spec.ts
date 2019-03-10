import { TestBed, inject } from '@angular/core/testing';
import { ProtectorAutomaticosService } from './protector-automatico.service';



describe('UsuarioService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProtectorAutomaticosService]
    });
  });

  it('should be created', inject([ProtectorAutomaticosService], (service: ProtectorAutomaticosService) => {
    expect(service).toBeTruthy();
  }));
});
