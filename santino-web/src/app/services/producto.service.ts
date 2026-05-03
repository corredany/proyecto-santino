import { Injectable } from '@angular/core';

export interface Image {
  itemImageSrc: string;
  thumbnailImageSrc: string;
  alt: string;
  title: string;
}

export interface Section {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  backgroundImage: string;
  images: Image[];
  materials: {
    title: string;
    images: Image[];
  };
  accessories: {
    title: string;
    images: Image[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  private sections: { [key: string]: Section } = {
    'nosotros': {
      id: 'nosotros',
      title: 'Nosotros',
      subtitle: 'Somos una empresa con raíces firmes y visión clara. Con años de experiencia en diseño, fabricación y carpintería, nos mueve un compromiso inquebrantable con cada cliente',
      description: '',
      backgroundImage: 'img/nosotros.jpeg',
      images: [
        {
          itemImageSrc: 'img/nosotros1.jpg',
          thumbnailImageSrc: 'img/nosotros1.jpg',
          alt: 'Vestidor moderno',
          title: 'Vestidor Moderno'
        },
        {
          itemImageSrc: 'img/nosotros2.jpeg',
          thumbnailImageSrc: 'img/nosotros2.jpeg',
          alt: 'Vestidor moderno',
          title: 'Vestidor Moderno'
        },
        {
          itemImageSrc: 'img/nosotros3.jpeg',
          thumbnailImageSrc: 'img/nosotros3.jpeg',
          alt: 'Vestidor moderno',
          title: 'Vestidor Moderno'
        }
      ],
      materials: {
        title: '',
        images: []
      },
      accessories: {
        title: '',
        images: []
      }
    },
    'cocinas': {
      id: 'cocinas',
      title: 'Cocinas',
      subtitle: 'Diseñamos closets personalizados que organizan tu espacio y reflejan tu estilo, con la calidad que mereces.',
      description: '',
      backgroundImage: 'img/cocinacomp.jpeg',
      images: [
        {
          itemImageSrc: 'img/cocina1.jpg',
          thumbnailImageSrc: 'img/cocina1.jpg',
          alt: 'Cocina moderna',
          title: 'Cocina Moderna'
        },
        {
          itemImageSrc: 'img/cocina2.jpeg',
          thumbnailImageSrc: 'img/cocina2.jpeg',
          alt: 'Cocina clásica',
          title: 'Cocina Clásica'
        },
        {
          itemImageSrc: 'img/cocina3.jpg',
          thumbnailImageSrc: 'img/cocina3.jpg',
          alt: 'Cocina Clásica',
          title: 'Cocina Clásica'
        }
      ],
      materials: {
        title: 'Materiales usados para el proyecto',
        images: [
          {
            itemImageSrc: 'img/granito900.jpg',
            thumbnailImageSrc: 'img/granito900.jpg',
            alt: 'Granito',
            title: 'Granito'
          },
          {
            itemImageSrc: 'img/madera900.jpg',
            thumbnailImageSrc: 'img/madera900.jpg',
            alt: 'Madera',
            title: 'Madera'
          },
          {
            itemImageSrc: 'img/marmol900.jpg',
            thumbnailImageSrc: 'img/marmol900.jpg',
            alt: 'Marmol',
            title: 'Marmol'
          }
        ]
      },
      accessories: {
        title: 'Aditamentos usados para el proyecto',
        images: [
          {
            itemImageSrc: 'img/hinge.jpg',
            thumbnailImageSrc: 'img/hinge.jpg',
            alt: 'Hinge',
            title: 'Hinge'
          },
          {
            itemImageSrc: 'img/madera2.jpg',
            thumbnailImageSrc: 'img/madera2.jpg',
            alt: 'Madera',
            title: 'Madera'
          },
          {
            itemImageSrc: 'img/ventana.jpg',
            thumbnailImageSrc: 'img/ventana.jpg',
            alt: 'Ventana',
            title: 'Ventana'
          }
        ]
      }
    },
    'closets': {
      id: 'closets',
      title: 'Closets',
      subtitle: 'Diseñamos muebles que transforman tus espacios en lugares únicos',
      description: 'Creamos muebles personalizados que combinan funcionalidad, durabilidad y diseño exclusivo.',
      backgroundImage: 'img/closetcomp.jpg',
      images: [
        {
          itemImageSrc: 'img/closet1.jpg',
          thumbnailImageSrc: 'img/closet1.jpg',
          alt: 'Closet moderno',
          title: 'Closet Moderno'
        },
        {
          itemImageSrc: 'img/closet2.jpeg',
          thumbnailImageSrc: 'img/closet2.jpeg',
          alt: 'Closet moderno',
          title: 'Closet Moderno'
        },
        {
          itemImageSrc: 'img/closet3.jpg',
          thumbnailImageSrc: 'img/closet3.jpg',
          alt: 'Closet moderno',
          title: 'Closet Moderno'
        }
      ],
      materials: {
        title: 'Materiales usados para el proyecto',
        images: [
          {
            itemImageSrc: 'img/granito900.jpg',
            thumbnailImageSrc: 'img/granito900.jpg',
            alt: 'Granito',
            title: 'Granito'
          },
          {
            itemImageSrc: 'img/madera900.jpg',
            thumbnailImageSrc: 'img/madera900.jpg',
            alt: 'Madera',
            title: 'Madera'
          },
          {
            itemImageSrc: 'img/marmol900.jpg',
            thumbnailImageSrc: 'img/marmol900.jpg',
            alt: 'Marmol',
            title: 'Marmol'
          }
        ]
      },
      accessories: {
        title: 'Aditamentos usados para el proyecto',
        images: [
          {
            itemImageSrc: 'img/hinge.jpg',
            thumbnailImageSrc: 'img/hinge.jpg',
            alt: 'Hinge',
            title: 'Hinge'
          },
          {
            itemImageSrc: 'img/madera2.jpg',
            thumbnailImageSrc: 'img/madera2.jpg',
            alt: 'Madera',
            title: 'Madera'
          },
          {
            itemImageSrc: 'img/ventana.jpg',
            thumbnailImageSrc: 'img/ventana.jpg',
            alt: 'Ventana',
            title: 'Ventana'
          }
        ]
      }
    },
    'muebles-banos': {
      id: 'muebles-banos',
      title: 'Muebles de baño',
      subtitle: 'Muebles de baño que combinan diseño, funcionalidad y calidad, creados para transformar tu espacio.',
      description: '',
      backgroundImage: 'img/banocomp.jpg',
      images: [
        {
          itemImageSrc: 'img/banos1.jpg',
          thumbnailImageSrc: 'img/banos1.jpg',
          alt: 'Banos modernos',
          title: 'Banos Modernos'
        },
        {
          itemImageSrc: 'img/banos2.jpg',
          thumbnailImageSrc: 'img/banos2.jpg',
          alt: 'Banos modernos',
          title: 'Banos Modernos'
        },
        {
          itemImageSrc: 'img/banos3.jpg',
          thumbnailImageSrc: 'img/banos3.jpg',
          alt: 'Banos modernos',
          title: 'Banos Modernos'
        }
      ],
      materials: {
        title: 'Materiales usados para el proyecto',
        images: [
          {
            itemImageSrc: 'img/granito900.jpg',
            thumbnailImageSrc: 'img/granito900.jpg',
            alt: 'Granito',
            title: 'Granito'
          },
          {
            itemImageSrc: 'img/madera900.jpg',
            thumbnailImageSrc: 'img/madera900.jpg',
            alt: 'Madera',
            title: 'Madera'
          },
          {
            itemImageSrc: 'img/marmol900.jpg',
            thumbnailImageSrc: 'img/marmol900.jpg',
            alt: 'Marmol',
            title: 'Marmol'
          }
        ]
      },
      accessories: {
        title: 'Aditamentos usados para el proyecto',
        images: [
          {
            itemImageSrc: 'img/hinge.jpg',
            thumbnailImageSrc: 'img/hinge.jpg',
            alt: 'Hinge',
            title: 'Hinge'
          },
          {
            itemImageSrc: 'img/madera2.jpg',
            thumbnailImageSrc: 'img/madera2.jpg',
            alt: 'Madera',
            title: 'Madera'
          },
          {
            itemImageSrc: 'img/ventana.jpg',
            thumbnailImageSrc: 'img/ventana.jpg',
            alt: 'Ventana',
            title: 'Ventana'
          }
        ]
      }
    },
    'vestidores': {
      id: 'vestidores',
      title: 'Vestidores',
      subtitle: 'Vestidores únicos, hechos para tu estilo de vida y pensados con compromiso en cada detalle.',
      description: '',
      backgroundImage: 'img/vestidorcomp.jpg',
      images: [
        {
          itemImageSrc: 'img/vestidor1.jpg',
          thumbnailImageSrc: 'img/vestidor1.jpg',
          alt: 'Vestidor moderno',
          title: 'Vestidor Moderno'
        },
        {
          itemImageSrc: 'img/vestidor2.jpg',
          thumbnailImageSrc: 'img/vestidor2.jpg',
          alt: 'Vestidor moderno',
          title: 'Vestidor Moderno'
        },
        {
          itemImageSrc: 'img/vestidor3.jpg',
          thumbnailImageSrc: 'img/vestidor3.jpg',
          alt: 'Vestidor moderno',
          title: 'Vestidor Moderno'
        }
      ],
      materials: {
        title: 'Materiales usados para el proyecto',
        images: [
          {
            itemImageSrc: 'img/granito900.jpg',
            thumbnailImageSrc: 'img/granito900.jpg',
            alt: 'Granito',
            title: 'Granito'
          },
          {
            itemImageSrc: 'img/madera900.jpg',
            thumbnailImageSrc: 'img/madera900.jpg',
            alt: 'Madera',
            title: 'Madera'
          },
          {
            itemImageSrc: 'img/marmol900.jpg',
            thumbnailImageSrc: 'img/marmol900.jpg',
            alt: 'Marmol',
            title: 'Marmol'
          }
        ]
      },
      accessories: {
        title: 'Aditamentos usados para el proyecto',
        images: [
          {
            itemImageSrc: 'img/hinge.jpg',
            thumbnailImageSrc: 'img/hinge.jpg',
            alt: 'Hinge',
            title: 'Hinge'
          },
          {
            itemImageSrc: 'img/madera2.jpg',
            thumbnailImageSrc: 'img/madera2.jpg',
            alt: 'Madera',
            title: 'Madera'
          },
          {
            itemImageSrc: 'img/ventana.jpg',
            thumbnailImageSrc: 'img/ventana.jpg',
            alt: 'Ventana',
            title: 'Ventana'
          }
        ]
      }
    },
    'diseno-interiores': {
      id: 'disenointer',
      title: 'Diseño de interiores',
      subtitle: 'Transformamos tus espacios con equilibrio entre estética y funcionalidad, creando ambientes únicos que se adaptan a tu estilo de vida',
      description: '',
      backgroundImage: 'img/diseno.jpg',
      images: [
        {
          itemImageSrc: 'img/diseno1.jpeg',
          thumbnailImageSrc: 'img/diseno1.jpeg',
          alt: 'Vestidor moderno',
          title: 'Vestidor Moderno'
        },
        {
          itemImageSrc: 'img/diseno2.jpeg',
          thumbnailImageSrc: 'img/diseno2.jpeg',
          alt: 'Vestidor moderno',
          title: 'Vestidor Moderno'
        },
        {
          itemImageSrc: 'img/diseno3.jpeg',
          thumbnailImageSrc: 'img/diseno3.jpeg',
          alt: 'Vestidor moderno',
          title: 'Vestidor Moderno'
        }
      ],
      materials: {
        title: 'Materiales usados para el proyecto',
        images: [
          {
            itemImageSrc: 'img/granito900.jpg',
            thumbnailImageSrc: 'img/granito900.jpg',
            alt: 'Granito',
            title: 'Granito'
          },
          {
            itemImageSrc: 'img/madera900.jpg',
            thumbnailImageSrc: 'img/madera900.jpg',
            alt: 'Madera',
            title: 'Madera'
          },
          {
            itemImageSrc: 'img/marmol900.jpg',
            thumbnailImageSrc: 'img/marmol900.jpg',
            alt: 'Marmol',
            title: 'Marmol'
          }
        ]
      },
      accessories: {
        title: 'Aditamentos usados para el proyecto',
        images: [
          {
            itemImageSrc: 'img/hinge.jpg',
            thumbnailImageSrc: 'img/hinge.jpg',
            alt: 'Hinge',
            title: 'Hinge'
          },
          {
            itemImageSrc: 'img/madera2.jpg',
            thumbnailImageSrc: 'img/madera2.jpg',
            alt: 'Madera',
            title: 'Madera'
          },
          {
            itemImageSrc: 'img/ventana.jpg',
            thumbnailImageSrc: 'img/ventana.jpg',
            alt: 'Ventana',
            title: 'Ventana'
          }
        ]
      }
    },
  };

  constructor() { }

  /**
   * Obtiene los datos de una sección específica
   * @param sectionId Identificador de la sección
   * @returns Promise con los datos de la sección
   */
  getSection(sectionId: string): Promise<Section> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const section = this.sections[sectionId];
        if (!section) {
          throw new Error(`Section ${sectionId} not found`);
        }
        resolve(section);
      }, 300);
    });
  }

  /**
   * Obtiene todas las secciones disponibles
   * @returns Promise con array de secciones
   */
  getAllSections(): Promise<Section[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Object.values(this.sections));
      }, 300);
    });
  }
}
