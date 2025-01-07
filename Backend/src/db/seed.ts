import { Research } from "./models/research";
import { Thesis } from "./models/thesis";
import { User } from "./models/user";
import { UserResearcher } from "./models/userResearcher";
import { Researcher } from "./models/researcher";
import { ApplicationPeriod } from "./models/applicationPeriod";
import { Announcement } from "./models/announcement";
import { UserAnnouncement } from "./models/userAnnouncement";


export const seedDatabase = async () => {
  const [executive, created0] = await User.findOrCreate({
    where: { email: "migueltorres@cenia.cl" },
    defaults: {
      email: "migueltorres@cenia.cl",
      username: "migueltorres10",
      rut: "11.885.928-6",
      names: "Miguel Alejandro",
      lastName: "Torres",
      secondLastName: "González",
      gender: "Masculino",
      phoneNumber: "987654321",
      researchLines: [],
      roleId: 1,
      institution: null,
      academicDegree: null,
      fullNameDegree: null,
      entryYear: null,
    },
  });
  if (created0) {
    console.log("Created executive user id:", executive.id, "email:", executive.email);
  } else {
    console.log("Executive user already exists id:", executive.id, "email:", executive.email);
  }

  const [estudiante1, created1] = await User.findOrCreate({
    where: { email: "marialopez@uc.cl" },
    defaults: {
      email: "marialopez@uc.cl",
      username: "marialopez12",
      rut: "19.989.528-1",
      names: "María",
      lastName: "López",
      secondLastName: "Martínez",
      gender: "Femenino",
      phoneNumber: "987654321",
      researchLines: ["DL for Vision and Language", "Human Centered AI"],
      roleId: 2,
      institution: "UC",
      academicDegree: "Grado de Doctorado",
      fullNameDegree: "Doctorado en Ciencias de la Ingeniería, área Ciencia de la Computación",
      entryYear: new Date(2021, 1, 1),
    },
  });
  if (created1) {
    console.log("Created student user id:", estudiante1.id, "email:", estudiante1.email);
  } else {
    console.log("Student user already exists id:", estudiante1.id, "email:", estudiante1.email);
  }

  const [estudiante2, created2] = await User.findOrCreate({
    where: { email: "carlosgarcia@uc.cl" },
    defaults: {
      email: "carlosgarcia@uc.cl",
      username: "carlosgarcia11",
      rut: "12345678-9",
      names: "Carlos",
      lastName: "García",
      secondLastName: "Rodríguez",
      gender: "Masculino",
      phoneNumber: "987654321",
      researchLines: ["Neuro-Symbolic AI", "DL for Vision and Language"],
      roleId: 2,
      institution: "UC",
      academicDegree: "Equivalente a Magister",
      fullNameDegree: "Magister en Ciencias de la Ingeniería",
      entryYear: new Date(2023, 0, 1),
    },
  });
  if (created2) {
    console.log("Created student user id:", estudiante2.id, "email:", estudiante2.email);
  } else {
    console.log("Student user already exists id:", estudiante2.id, "email:", estudiante2.email);
  }

  const [estudiante3, created3] = await User.findOrCreate({
    where: { email: "mariarodriguez@uc.cl" },
    defaults: {
      email: "mariarodriguez@uc.cl",
      username: "mariarodriguez22",
      rut: "98765432-1",
      names: "María",
      lastName: "Rodríguez",
      secondLastName: "Fernández",
      gender: "Femenino",
      phoneNumber: "912345678",
      researchLines: ["Sustainable Development", "Environmental Engineering"],
      roleId: 2,
      institution: "UC",
      academicDegree: "Grado de Licenciatura o Título Profesional",
      fullNameDegree: "Licenciatura en Ingeniería Civil",
      entryYear: new Date(2022, 0, 1),
    },
  });
  if (created3) {
    console.log("Created student user id:", estudiante3.id, "email:", estudiante3.email);
  } else {
    console.log("Student user already exists id:", estudiante3.id, "email:", estudiante3.email);
  }  

  const announcements = await Announcement.bulkCreate([
    { 
      title: "Práctica en Inteligencia Artificial", 
      description: "Oportunidad para aplicar conocimientos de IA en un proyecto real.",
      isClosed: true,
    },
    { 
      title: "Pasantía en Visión Computacional", 
      description: "Únete a un equipo innovador en el desarrollo de sistemas de visión." 
    },
    { 
      title: "Beca en Aprendizaje Automático", 
      description: "Apoyo financiero para estudios avanzados en machine learning." 
    },
    { 
      title: "Proyecto de Investigación en Neuro-Symbolic AI", 
      description: "Explora proyectos desafiantes en la intersección de neurociencia y IA simbólica.",
      isClosed: true,
    },
    { 
      title: "Asistente de Investigación en Física Informada", 
      description: "Colabora en un proyecto que integra física e inteligencia artificial." 
    },
  ]);

  await UserAnnouncement.bulkCreate([
    { 
      announcementId: announcements[0].id, 
      userId: estudiante1.id, 
      motivationMessage: "Me interesa aplicar mis conocimientos en IA." 
    },
    { 
      announcementId: announcements[1].id, 
      userId: estudiante2.id, 
      motivationMessage: "Tengo experiencia en visión computacional y quiero aprender más." 
    },
    { 
      announcementId: announcements[2].id, 
      userId: estudiante1.id, 
      motivationMessage: "Quiero continuar mis estudios en machine learning." 
    },
    { 
      announcementId: announcements[3].id, 
      userId: estudiante2.id, 
      motivationMessage: "Estoy interesado en la combinación de neurociencia e IA." 
    },
    { 
      announcementId: announcements[4].id, 
      userId: estudiante1.id, 
      motivationMessage: "Este proyecto es relevante para mis intereses en física y IA." 
    },
  ]);

  const [applicationPeriod, created4] = await ApplicationPeriod.findOrCreate({
    where: { periodTitle: "Periodo de postulación a becas CENIA 2025" },
    defaults: {
      periodTitle: "Periodo de postulación a becas CENIA 2025",
      startDate: new Date(2024, 3, 15),
      endDate: new Date(2024, 11, 30),
      periodDescription:
        "Este periodo de postulación está destinado a los estudiantes interesados en postular a las becas CENIA que serán entregadas en el año académico 2025. " +
        "Las becas están dirigidas a estudiantes de pregrado y postgrado que demuestren excelencia académica y compromiso con la investigación.",
    },
  });
  if (created4) {
    console.log("Created application period id:", applicationPeriod.id, "title:", applicationPeriod.periodTitle);
  } else {
    console.log("Application period already exists id:", applicationPeriod.id, "title:", applicationPeriod.periodTitle);
  }

  await Thesis.findOrCreate({
    where: { userId: estudiante1.id, },
    defaults: {
      title: "Implementación de Algoritmos de Aprendizaje Automático en el Diagnóstico de Enfermedades Cardiovasculares",
      status: "En progreso",
      startDate: new Date(2023, 8, 1),
      endDate: new Date(2025, 2, 12),
      userId: estudiante1.id,
    },
  });

  await Thesis.findOrCreate({
    where: { userId: estudiante2.id, },
    defaults: {
      title: "Evaluación del Impacto del Cambio Climático en la Biodiversidad de los Ecosistemas Marinos",
      status: "En progreso",
      startDate: new Date(2024, 1, 1),
      endDate: new Date(2025, 3, 16),
      userId: estudiante2.id,
    },
  });

  const researcherData = [
    {
      names: "Juan Carlos",
      lastName: "Herrera",
      secondLastName: "Maldonado",
      nationality: "Chile",
      rut: "12345678-1",
      email: "jch@ing.puc.cl",
      phone: "+56945672345",
      charge: "Other Researcher",
      researchLines: "Brain-Inspired AI; DL for Vision and Language; Human Centered AI; Neuro-Symbolic AI; Physics-Informed Machine Learning",
      highestTitle: "Ingeniero Civil De Industrias",
      highestDegree: "Phd Degree",
    },
    {
      names: "Valeria",
      lastName: "Herskovic",
      secondLastName: null,
      nationality: "Chile",
      rut: "12345678-2",
      email: "vherskov@ing.puc.cl",
      phone: "56 945672345",
      charge: "Associate Researcher",
      researchLines: "Human Centered AI",
      highestTitle: "Ingeniería Civil En Computación",
      highestDegree: "Phd Degree",
    },
    {
      names: "Marcelo",
      lastName: "Mendoza",
      secondLastName: null,
      nationality: "Chile",
      rut: "12345678-3",
      email: "marcelo.mendoza@usm.cl",
      phone: "56945672345",
      charge: "Main Researcher",
      researchLines: "Human Centered AI",
      highestTitle: "Ingeniero Civil Electronico",
      highestDegree: "Phd Degree",
    },
    {
      names: "Paula Andrea",
      lastName: "Aguirre",
      secondLastName: "Aparicio",
      nationality: "Chile",
      rut: "12345678-4",
      email: "paaguirr@ing.puc.cl",
      phone: "+56945672345",
      charge: "Main Researcher",
      researchLines: "Physics-Informed Machine Learning",
      highestTitle: "Ingeniero Civil Mecánico",
      highestDegree: "Phd Degree",
    },
    {
      names: "Juan Demóstenes",
      lastName: "Bekios",
      secondLastName: "Calfa",
      nationality: "Chile",
      rut: "12345678-5",
      email: "juan.bekios@ucn.cl",
      phone: "56945672345",
      charge: "Other Researcher",
      researchLines: "Brain-Inspired AI; DL for Vision and Language; Human Centered AI; Neuro-Symbolic AI; Physics-Informed Machine Learning",
      highestTitle: "Ingeniería Civil En Computación E Informática",
      highestDegree: "Phd Degree",
    },
    {
      names: "Carlos Marcelo",
      lastName: "Hernández",
      secondLastName: "Ulloa",
      nationality: "Chile",
      rut: "12345678-6",
      email: "chernan.ucsc@gmail.com",
      phone: "56945672345",
      charge: "Associate Researcher",
      researchLines: "Neuro-Symbolic AI",
      highestTitle: "Ingeniero Civil Informático",
      highestDegree: "Phd Degree",
    },
    {
      names: "Marcelo Enrique",
      lastName: "Matus",
      secondLastName: "Acuña",
      nationality: "Chile",
      rut: "12345678-7",
      email: "marcelomatusacuna@gmail.com",
      phone: "56945672345",
      charge: "Other Researcher",
      researchLines: "Brain-Inspired AI; DL for Vision and Language; Human Centered AI; Neuro-Symbolic AI; Physics-Informed Machine Learning",
      highestTitle: "Ingeniero Civil Electricista",
      highestDegree: "Phd Degree",
    },
    {
      names: "María Paz",
      lastName: "Hermosilla",
      secondLastName: "Cornejo",
      nationality: "Chile",
      rut: "12345678-8",
      email: "mphermosilla@gmail.com",
      phone: "+56945672345",
      charge: "Other Researcher",
      researchLines: "Human Centered AI",
      highestTitle: "Administración Pública",
      highestDegree: "Master Or Equivalent",
    },
    {
      names: "Romina Debora",
      lastName: "Torres",
      secondLastName: "Torres",
      nationality: "Chile",
      rut: "12345678-9",
      email: "romina.torres.t@uai.cl",
      phone: "56945672345",
      charge: "Other Researcher",
      researchLines: "Human Centered AI",
      highestTitle: "Titulada, Magister Y Doctora En Ingeniería En Informática",
      highestDegree: "Phd Degree",
    },
    {
      names: "Jorge Andrés",
      lastName: "Baier",
      secondLastName: "Aranda",
      nationality: "Chile",
      rut: "12345679-1",
      email: "jabaier@ing.puc.cl",
      phone: "+56945672345",
      charge: "Associate Researcher",
      researchLines: "Neuro-Symbolic AI",
      highestTitle: "Ingeniero Civil De Industrias Con Mención En Computación",
      highestDegree: "Phd Degree",
    },
    {
      names: "Pamela Beatriz",
      lastName: "Guevara",
      secondLastName: "Alvez",
      nationality: "Chile",
      rut: "12345679-2",
      email: "pamela.guevara@gmail.com",
      phone: "+56945672345",
      charge: "Associate Researcher",
      researchLines: "Brain-Inspired AI",
      highestTitle: "Electronics Engineer",
      highestDegree: "Phd Degree",
    },
  ]

  for (const data of researcherData) {
    await Researcher.findOrCreate({
      where: { email: data.email },
      defaults: data,
    });
  }

  const researcher = await Researcher.findOne();

  await UserResearcher.findOrCreate({
    where: { user_id: estudiante1.id },
    defaults: {
      user_id: estudiante1.id,
      researcher_id: researcher.id,
      tutorRol: "Tutor Principal",
    },
  });

  await UserResearcher.findOrCreate({
    where: { user_id: estudiante2.id },
    defaults: {
      user_id: estudiante2.id,
      researcher_id: researcher.id,
      tutorRol: "Tutor Principal",
    },
  });

  const researchData = [
    {
      id: 63798,
      doi: '10.4230/LIPIcs.CSL.2024.34',
      authors: ['Kozachinskiy, Alexander'],
      title: 'Energy Games over Totally Ordered Groups',
      journal: 'Leibniz International Proceedings in Informatics',
      volume: '288',
      yearPublished: 2024,
      firstPage: '1',
      lastPage: '12',
      notes: '',
      indexed: ['Scopus - Indexed', 'ISI - Indexed'],
      funding: 'Pia',
      researchLines: ['Neuro-Symbolic AI'],
      progressReport: 3,
      ceniaParticipants: [{ name: 'Alexander Kozachinskiy', role: 'Postdoctoral Fellow' }],
      roleParticipations: ['Postdoctoral Fellows'],
      link: 'https://drops.dagstuhl.de/entities/document/10.4230/LIPIcs.CSL.2024.34',
      anidNotes: '',
    },
    {
      id: 62620,
      doi: '10.1145/3627985',
      authors: ['Abeiluk, Andrés', 'Elbassioni, Khaled', 'Rahwan, Talal', 'Cebrian, Manuel', 'Rahwan, Lyad'],
      title: 'Price of Anarchy in Algorithmic Matching of Romantic Partners',
      journal: 'ACM Transactions on Economics and Computation',
      volume: '12',
      yearPublished: 2024,
      firstPage: '1',
      lastPage: '25',
      notes: '',
      indexed: ['ISI - Indexed'],
      funding: 'Pia',
      researchLines: ['Human Centered AI'],
      progressReport: 3,
      ceniaParticipants: [{ name: 'Andrés Jonathan Abeliuk Kimelman', role: 'Associate Researcher' }],
      roleParticipations: ['Associated Researchers'],
      link: 'https://dl.acm.org/doi/10.1145/3627985',
      anidNotes: '',
    },
    {
      id: 63639,
      doi: '10.1080/01691864.2024.2353119',
      authors: ['Sepulveda, Gabriel', 'Vazquez, Marynel', 'Soto, Alvaro'],
      title: 'APEX: affordance-based plan executor for indoor robotic navigation',
      journal: 'ADVANCED ROBOTICS',
      volume: '38',
      yearPublished: 2024,
      firstPage: '849',
      lastPage: '862',
      notes: '',
      indexed: ['ISI - Indexed'],
      funding: 'Pia',
      researchLines: ['DL for Vision and Language'],
      progressReport: 3,
      ceniaParticipants: [
        { name: 'Alvaro Marcelo Soto Arriaza', role: 'Director' },
        { name: 'Gabriel Sepúlveda Villalobos', role: 'PhD Thesis' }
      ],
      roleParticipations: ['Main Researchers', 'Thesis Students'],
      link: 'https://www.tandfonline.com/doi/full/10.1080/01691864.2024.2353119',
      anidNotes: '',
    },
    {
      id: 62633,
      doi: '10.1007/978-3-031-56063-7_41',
      authors: ['Muñoz, Carlos', 'Apolo, María José', 'Ojeda, Maximiliano', 'Lobel, Hans', 'Mendoza, Marcelo'],
      title: 'News Gathering: Leveraging Transformers to Rank News',
      journal: 'Advances in Information Retrieval',
      volume: '46',
      yearPublished: 2024,
      firstPage: '1',
      lastPage: '8',
      notes: '',
      indexed: ['ISI - Indexed'],
      funding: 'Pia',
      researchLines: ['DL for Vision and Language', 'Human Centered AI'],
      progressReport: 3,
      ceniaParticipants: [
        { name: 'Marcelo Mendoza', role: 'Main Researcher' },
        { name: 'Hans Albert Lobel Díaz', role: 'Associate Researcher' }
      ],
      roleParticipations: ['Main Researchers', 'Associated Researchers'],
      link: 'https://link.springer.com/chapter/10.1007/978-3-031-56063-7_41',
      anidNotes: '',
    },
    {
      id: 62618,
      doi: '10.1002/dad2.12467',
      authors: ['Medel, Vicente', 'Delano, Paul H.', 'Belkhiria, Chama', 'Leiva, Alexis', 'De Gatica, Cristina',
        'Vidal, Victor', 'Navarro, Carlos F.', 'Martin, Simon San', 'Martinez, Melissa', 'Gierke, Christine',
        'Garcia, Ximena', 'Cerda, Mauricio', 'Vergara, Rodrigo', 'Delgado, Carolina', 'Farias, Gonzalo A.'],
      title: 'Cochlear dysfunction as an early biomarker of cognitive decline in normal hearing and mild hearing loss',
      journal: "ALZHEIMER'S & DEMENTIA: DIAGNOSIS, ASSESSMENT & DISEASE MONITORING",
      volume: '16',
      yearPublished: 2024,
      firstPage: '1',
      lastPage: '9',
      notes: '',
      indexed: ['Scopus - Indexed'],
      funding: 'Pia',
      researchLines: ['Brain-Inspired AI'],
      progressReport: 3,
      ceniaParticipants: [{ name: 'Rodrigo Clemente Vergara Ortúzar', role: 'Associate Researcher' }],
      roleParticipations: ['Associated Researchers'],
      link: 'https://alz-journals.onlinelibrary.wiley.com/doi/full/10.1002/dad2.12467',
      anidNotes: '',
    },
    {
      id: 63648,
      doi: '10.1016/j.apenergy.2024.123760',
      authors: ['Astete, Iván', 'Castro, Margarita', 'Lorca, Álvaro', 'Negrete-Pincetic, Matías'],
      title: 'Optimal cleaning scheduling for large photovoltaic portfolios',
      journal: 'Applied Energy',
      volume: '372',
      yearPublished: 2024,
      firstPage: '1',
      lastPage: '13',
      notes: '',
      indexed: ['ISI - Indexed'],
      funding: 'Pia',
      researchLines: ['DL for Vision and Language'],
      progressReport: 3,
      ceniaParticipants: [{ name: 'Margarita Paz Castro Anich', role: 'Associate Researcher' }],
      roleParticipations: ['Associated Researchers'],
      link: 'https://www.sciencedirect.com/science/article/pii/S0306261924011437',
      anidNotes: '',
    },
    {
      id: 63647,
      doi: '10.1007/s00253-024-13111-8',
      authors: ['Deantas-Jahn, Carolina', 'Mendoza, Sebastian N.', 'Licona-Cassani, Cuauhtemoc', 'Orellana, Camila', 'Saa, Pedro A.'],
      title: 'Metabolic modeling of Halomonas campaniensis improves polyhydroxybutyrate production under nitrogen limitation',
      journal: 'APPLIED MICROBIOLOGY AND BIOTECHNOLOGY',
      volume: '108',
      yearPublished: 2024,
      firstPage: '1',
      lastPage: '16',
      notes: '',
      indexed: ['ISI - Indexed'],
      funding: 'Pia',
      researchLines: ['Neuro-Symbolic AI'],
      progressReport: 3,
      ceniaParticipants: [{ name: 'Pedro Andrés Saa Higuera', role: 'Associate Researcher' }],
      roleParticipations: ['Associated Researchers'],
      link: 'https://link.springer.com/article/10.1007/s00253-024-13111-8',
      anidNotes: '',
    },
    {
      id: 63644,
      doi: '10.3390/app14083206',
      authors: ['Sanabria, Pablo', 'Montoya, Sebastian', 'Neyem, Andres', 'Icarte, Rodrigo Toro', 'Hirsch, Matias', 'Mateos, Cristian'],
      title: 'Connection-Aware Heuristics for Scheduling and Distributing Jobs under Dynamic Dew Computing Environments',
      journal: 'APPLIED SCIENCES-BASEL',
      volume: '14',
      yearPublished: 2024,
      firstPage: '1',
      lastPage: '22',
      notes: '',
      indexed: ['ISI - Indexed'],
      funding: 'Pia',
      researchLines: ['DL for Vision and Language'],
      progressReport: 3,
      ceniaParticipants: [
        { name: 'Hugo Andres Neyem', role: 'Associate Researcher' },
        { name: 'Rodrigo Andrés Toro Icarte', role: 'Associate Researcher' },
        { name: 'Pablo Sanabria Quispe', role: 'PhD Thesis' },
        { name: 'Sebastián Ignacio Montoya Tapia', role: 'Master Thesis' }
      ],
      roleParticipations: ['Associated Researchers', 'Thesis Students'],
      link: 'https://www.mdpi.com/2076-3417/14/8/3206',
      anidNotes: '',
    },
    {
      id: 63642,
      doi: '10.48550/arXiv.2405.14043',
      authors: ['Freire-Vidal, Yerka', 'Fajardo, Gabriela', 'Rodriguez-Sickert, Carlos', 'Graells-Garrido, Eduardo', 'Muñoz-Reyez, José Antonio', 'Figueroa, Oriana'],
      title: 'Attitudes Towards Migration in a COVID-19 Context: Testing a Behavioral Immune System Hypothesis with Twitter Data',
      journal: 'Arxiv',
      volume: '2024',
      yearPublished: 2024,
      firstPage: '1',
      lastPage: '18',
      notes: '',
      indexed: ['Not Indexed'],
      funding: 'Pia',
      researchLines: ['Human Centered AI'],
      progressReport: 3,
      ceniaParticipants: [{ name: 'Eduardo Nicolás Graells Garrido', role: 'Other Researcher' }],
      roleParticipations: ['Associated Researchers'],
      link: 'https://arxiv.org/abs/2405.14043',
      anidNotes: '',
    },
    {
      id: 62622,
      doi: '10.48550/arXiv.2401.07973',
      authors: ['Barbieri, Sebastián', 'Carrasco-Vargas, Nicanor', 'Rojas, Cristóbal'],
      title: 'Effective dynamical systems beyond dimension zero and factors of SFTs',
      journal: 'Arxiv',
      volume: 'preprint',
      yearPublished: 2024,
      firstPage: '1',
      lastPage: '39',
      notes: '',
      indexed: ['Not Indexed'],
      funding: 'Pia',
      researchLines: ['Neuro-Symbolic AI'],
      progressReport: 3,
      ceniaParticipants: [
        { name: 'Luis Cristobal Rojas Gonzalez', role: 'Main Researcher' },
        { name: 'Nicanor Carrasco Vargas', role: 'PhD Thesis' }
      ],
      roleParticipations: ['Main Researchers', 'Thesis Students'],
      link: 'https://arxiv.org/abs/2401.07973',
      anidNotes: '',
    }
  ];

  for (const data of researchData) {
    await Research.findOrCreate({
      where: { id: data.id },
      defaults: data,
    });
  }
};
