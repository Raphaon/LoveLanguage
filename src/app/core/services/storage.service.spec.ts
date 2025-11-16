import { TestBed } from '@angular/core/testing';
import { Storage } from '@ionic/storage-angular';
import { StorageService } from './storage.service';

type StorageInstance = Pick<Storage, 'set' | 'get' | 'remove' | 'clear' | 'keys'>;

describe('StorageService', () => {
  let service: StorageService;
  let storageSpy: jasmine.SpyObj<Storage>;
  let storeInstance: jasmine.SpyObj<StorageInstance>;

  beforeEach(() => {
    storeInstance = jasmine.createSpyObj<StorageInstance>('StorageInstance', [
      'set',
      'get',
      'remove',
      'clear',
      'keys'
    ]);

    storeInstance.set.and.returnValue(Promise.resolve());
    storeInstance.get.and.returnValue(Promise.resolve(undefined));
    storeInstance.remove.and.returnValue(Promise.resolve());
    storeInstance.clear.and.returnValue(Promise.resolve());
    storeInstance.keys.and.returnValue(Promise.resolve([]));

    storageSpy = jasmine.createSpyObj<Storage>('Storage', ['create']);
    storageSpy.create.and.returnValue(Promise.resolve(storeInstance as unknown as Storage));

    TestBed.configureTestingModule({
      providers: [
        StorageService,
        { provide: Storage, useValue: storageSpy }
      ]
    });

    service = TestBed.inject(StorageService);
  });

  it('should initialize storage before ready resolves', async () => {
    await service.ready();

    expect(storageSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should allow storing and retrieving values after initialization', async () => {
    const payload = { foo: 'bar' };
    storeInstance.get.and.returnValue(Promise.resolve(payload));

    await service.ready();
    await service.set('test-key', payload);
    const value = await service.get('test-key');

    expect(storeInstance.set).toHaveBeenCalledWith('test-key', payload);
    expect(storeInstance.get).toHaveBeenCalledWith('test-key');
    expect(value).toEqual(payload);
  });
});
