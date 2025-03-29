import { TestBed } from '@angular/core/testing';

// import { OfflineServiceService } from './offline-service.service';
import { OfflineService } from './offline-service.service';


describe('OfflineServiceService', () => {
  // let service: OfflineServiceService;
  let service: OfflineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfflineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
