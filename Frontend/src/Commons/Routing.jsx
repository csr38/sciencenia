import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../Home.jsx';
import AuthLogin from '../Auth0/AuthLogin.jsx';
import TestToken from '../Auth0/TestToken.jsx'; // Reincorporado
import StudentProfile from '../Student/StudentProfile.jsx';
import EditStudentProfileForm from '../Student/EditStudentProfileForm.jsx';
import ThesisDetails from '../Student/ThesisDetails.jsx';
import Observatorio from './Observatorio.jsx';
import Unauthorized from './Unauthorized.jsx';
import ManageStudents from '../Executive/ManageStudents.jsx';
import ManageInvestigators from '../Executive/ManageInvestigators.jsx';
import ManageThesis from '../Executive/ManageThesis.jsx';
import CreateThesisForm from '../Executive/CreateThesisForm.jsx';
import EditThesisForm from '../Executive/EditThesisForm.jsx';
import EditThesisFormStudent from '../Student/EditThesisForm.jsx';
import ObserveUsers from '../Executive/ObserveUsers.jsx';
import ManagePublications from '../Executive/ManagePublications.jsx';
import EditPublication from '../Executive/EditPublication.jsx';
import ManageUsers from '../Executive/ManageUsers.jsx';
import EditProfiles from '../Executive/EditProfiles.jsx';
import EditProfileForm from '../Executive/EditProfileForm.jsx';
import ManageAllPublications from '../Executive/ManageAllPublications.jsx';
import Solicitudes from '../Solicitudes/Solicitudes.jsx';
import SolicitudesDeRecursos from '../Solicitudes/Recursos/SolicitudesDeRecursos.jsx';
import MisSolicitudes from '../Solicitudes/Recursos/MisSolicitudes.jsx';
import NuevaSolicitud from '../Solicitudes/Recursos/NuevaSolicitud.jsx';
import MiTutor from '../Student/MiTutor.jsx';
import MisEstudiantes from '../Executive/MisEstudiantes.jsx';
import SolicitudesEjecutivo from '../Executive/Solicitudes/SolicitudesEjecutivo.jsx';
import VerSolicitudesDeFondos from '../Executive/Solicitudes/Fondos/VerSolicitudesDeFondos.jsx';
import ManejarSolicitudesFondos from '../Executive/Solicitudes/Fondos/ManejarSolicitudesFondos.jsx'; 
import VerSolicitudFondos from '../Executive/Solicitudes/Fondos/VerSolicitudFondos.jsx'; 
import ProcesosPostulacionIncentivos from '../Executive/Solicitudes/Incentivos/ProcesosPostulacionIncentivos.jsx';
import CrearNuevoProceso from '../Executive/Solicitudes/Incentivos/CrearNuevoProceso.jsx';
import EditarProceso from '../Executive/Solicitudes/Incentivos/EditarProceso.jsx';
import NotificarProcesos from '../Executive/Solicitudes/Incentivos/NotificarProcesos.jsx';
import ManejarSolicitudesIncentivos from '../Executive/Solicitudes/Incentivos/ManejarSolicitudesIncentivos.jsx';
import CrearAnuncio from '../Executive/CrearAnuncio.jsx';
import ManageAnuncios from '../Executive/ManageAnuncios.jsx';
import UploadStudent from '../Executive/UploadStudent.jsx';
import UploadResearcher from '../Executive/UploadResearcher.jsx';
import VerMiSolicitud from '../Solicitudes/Recursos/VerMiSolicitud.jsx'
import VerSolicitudIncentivos from '../Executive/Solicitudes/Incentivos/VerSolicitudIncentivos.jsx'
import SolicitudesDeIncentivos from '../Solicitudes/Incentivos/SolicitudesDeIncentivos.jsx';
import NuevaSolicitudIncentivo from '../Solicitudes/Incentivos/NuevaSolicitudIncentivo.jsx';
import VerMiSolicitudDeIncentivo from '../Solicitudes/Incentivos/VerMiSolicitudDeIncentivo.jsx'
import RegistrarDatos from './RegistrarDatos.jsx'
import UploadResearch from '../Executive/UploadResearch.jsx';
import Investigadores from './Investigadores.jsx';
import Investigador from './Investigador.jsx';
import AllAnnouncements from '../Student/AllAnnouncements.jsx';
import Presupuestos from '../Executive/Presupuestos.jsx';
import VerPresupuestos from '../Executive/VerPresupuestos.jsx';
import EditarAnuncio from '../Executive/EditAnuncio.jsx';
import ReplyAnnouncement from '../Student/ReplyAnnouncement.jsx';
import ReviewMessages from '../Executive/ReviewMessages.jsx';

function Routing(){
    return (
        <>
        <BrowserRouter>
            <Routes>   
                <Route path="/" element={<Home />} />
                <Route path="/authlogin" element={<AuthLogin />} />
                <Route path="/signup" element={<AuthLogin />} />
                <Route path="/TestToken" element={<TestToken />} /> {/* Reincorporado */}
                <Route path="/StudentProfile" element={<StudentProfile />} />
                <Route path="/EditStudentProfile" element={<EditStudentProfileForm />} />
                <Route path="/ThesisDetails" element={<ThesisDetails />} />
                <Route path="/Observatorio" element={<Observatorio />} />
                <Route path="/Unauthorized" element={<Unauthorized />} />
                <Route path="/ManageStudents" element={<ManageStudents />} />
                <Route path="/ManageInvestigators" element={<ManageInvestigators />} />
                <Route path="/ManageThesis/:email" element={<ManageThesis />} />
                <Route path="/CreateThesisForm/:email" element={<CreateThesisForm />} />
                <Route path="/EditThesisForm/:email" element={<EditThesisForm />} />
                <Route path="/EditThesisForm" element={<EditThesisFormStudent />} />
                <Route path="/ObserveUsers/:email" element={<ObserveUsers />} />
                <Route path="/ManagePublications/:email" element={<ManagePublications />} />
                <Route path="/EditPublication/:id" element={<EditPublication />} />
                <Route path="/ManageUsers" element={<ManageUsers />} />
                <Route path="/EditProfiles" element={<EditProfiles />} />
                <Route path="/EditProfileForm/:email" element={<EditProfileForm />} />
                <Route path="/ManageAllPublications" element={<ManageAllPublications />} />
                <Route path="/Solicitudes" element={<Solicitudes />} />
                <Route path="/SolicitudesDeRecursos" element={<SolicitudesDeRecursos />} />
                <Route path="/SolicitudesDeIncentivos" element={<SolicitudesDeIncentivos />} />
                <Route path="/MisSolicitudes" element={<MisSolicitudes />} />
                <Route path="/NuevaSolicitud" element={<NuevaSolicitud />} />
                <Route path="/NuevaSolicitudIncentivo/:id" element={<NuevaSolicitudIncentivo />} />
                <Route path="/MiTutor" element={<MiTutor />} />
                <Route path="/MisEstudiantes" element={<MisEstudiantes />} />
                <Route path="/SolicitudesEjecutivo" element={<SolicitudesEjecutivo />} />
                <Route path="/VerSolicitudesDeFondos" element={<VerSolicitudesDeFondos />} />
                <Route path="/ManejarSolicitudesFondos" element={<ManejarSolicitudesFondos />} />
                <Route path="/VerSolicitudFondos/:id" element={<VerSolicitudFondos />} />
                <Route path="/ProcesosPostulacionIncentivos" element={<ProcesosPostulacionIncentivos />} />
                <Route path="/CrearNuevoProceso" element={<CrearNuevoProceso />} />
                <Route path="/EditarProceso/:id" element={<EditarProceso />} />
                <Route path="/NotificarProcesos" element={<NotificarProcesos />} />
                <Route path="/ManejarSolicitudesIncentivos/:id" element={<ManejarSolicitudesIncentivos />} />
                <Route path="/CrearAnuncio" element={<CrearAnuncio/>}/>
                <Route path="/ManageAnuncios" element={<ManageAnuncios/>}/>
                <Route path="/UploadStudent" element={<UploadStudent/>}/>
                <Route path="/UploadResearcher" element={<UploadResearcher/>}/>
                <Route path="/UploadResearch" element={<UploadResearch/>}/>
                <Route path="/VerMiSolicitud/:id" element={<VerMiSolicitud />} />
                <Route path="/VerSolicitudIncentivos/:id" element={<VerSolicitudIncentivos />} />
                <Route path="/VerMiSolicitudDeIncentivo/:id" element={<VerMiSolicitudDeIncentivo />} />
                <Route path="/RegistrarDatos" element={<RegistrarDatos />} />
                <Route path="/Investigadores" element={<Investigadores />} />
                <Route path="/Investigador/:email" element={<Investigador />} />
                <Route path="/AllAnnouncements" element={<AllAnnouncements />} />
                <Route path="/Presupuestos" element={<Presupuestos />} />
                <Route path="/VerPresupuestos" element={<VerPresupuestos />} />
                <Route path="/EditarAnuncio/:id" element={<EditarAnuncio />} />
                <Route path="/ReplyAnnouncement/:announcementId" element={<ReplyAnnouncement />} />
                <Route path="/ReviewMessages/:announcementId" element={<ReviewMessages />} />
            </Routes>
        </BrowserRouter>
        </>

    )
}

export default Routing
