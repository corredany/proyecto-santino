import { Video } from '../../../src/domain/entities/video.entity';

describe('Video Entity', () => {
  it('debe asignar todas las propiedades desde el constructor', () => {
    const fecha = new Date();
    const video = new Video({
      id: 1,
      url: 'http://localhost:3000/uploads/videos/clip.mp4',
      rutaArchivo: 'videos/clip.mp4',
      orden: 1,
      seccionId: 2,
      creadoPor: 1,
      actualizadoPor: 1,
      creadoEn: fecha,
      actualizadoEn: fecha,
    });

    expect(video.id).toBe(1);
    expect(video.url).toBe('http://localhost:3000/uploads/videos/clip.mp4');
    expect(video.rutaArchivo).toBe('videos/clip.mp4');
    expect(video.orden).toBe(1);
    expect(video.seccionId).toBe(2);
    expect(video.creadoPor).toBe(1);
    expect(video.actualizadoPor).toBe(1);
    expect(video.creadoEn).toBe(fecha);
    expect(video.actualizadoEn).toBe(fecha);
  });

  it('debe aceptar seccionId como null', () => {
    const video = new Video({ seccionId: null });
    expect(video.seccionId).toBeNull();
  });

  it('debe aceptar creadoPor y actualizadoPor como null', () => {
    const video = new Video({ creadoPor: null, actualizadoPor: null });
    expect(video.creadoPor).toBeNull();
    expect(video.actualizadoPor).toBeNull();
  });

  it('debe permitir construcción parcial', () => {
    const video = new Video({ id: 7, orden: 3 });
    expect(video.id).toBe(7);
    expect(video.orden).toBe(3);
    expect(video.url).toBeUndefined();
  });
});
