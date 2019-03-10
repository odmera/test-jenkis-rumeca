import { TestBed, inject } from '@angular/core/testing';

import { AuntenticacionFirebaseService } from './auntenticacion-firebase.service';

describe('AuntenticacionFirebaseService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuntenticacionFirebaseService]
    });
  });

  it('should be created', inject([AuntenticacionFirebaseService], (service: AuntenticacionFirebaseService) => {
    expect(service).toBeTruthy();
  }));
});
