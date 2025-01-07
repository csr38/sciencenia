import React, { useState, useEffect } from "react";
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import Navbar from "../../Commons/Navbar";
import styles from '../../styles/NuevaSolicitud.module.css';
import { useNavigate } from 'react-router-dom';

const NuevaSolicitud = () => {
  const { isLoading, user, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const [userBack, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isLoading && user) {
        try {
          const accessToken = await getAccessTokenSilently();
          const url = `${import.meta.env.VITE_BACKEND_URL}/users/${user.email}`;
          const response = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });
          setUser(response.data);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [user, isLoading, getAccessTokenSilently]);

  useEffect(() => {
    if (userBack) {
      setFormData({
        ...formData,
        emailApplicant: userBack.email,
        applicantFullName: `${userBack.names} ${userBack.lastName}`,
        role: userBack.roleId,
      });
    }
  }, [userBack]);

  const [formData, setFormData] = useState({
    emailApplicant: "",
    applicantFullName: "",
    role: "",
    purpose: '',
    otherPurpose: '',
    resultingWork: '',
    destination: '',
    startDate: '',
    durationPeriod: '',
    financingType: [],
    otherFinancingType: '',
    outsideFinancing: false,
    outsideFinancingSponsors: '',
    conferenceName: '',
    conferenceRanking: '',
    researchName: '',
    researchAbstract: '',
    acknowledgment: '',
    acknowledgmentProof: '',
    outsideAcknowledgment: '',
    outsideAcknowledgmentName: '',
    participationType: '',
    amountRequested: 0,
    files: [] 
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prevState => ({
        ...prevState,
        [name]: checked
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleFileChange = (e) => {
    const { files } = e.target;
    setFormData(prevState => ({
      ...prevState,
      files: [...prevState.files, ...files]
    }));
  };

  const handleRemoveFile = (index) => {
    setFormData(prevState => ({
      ...prevState,
      files: prevState.files.filter((_, i) => i !== index)
    }));
  };

  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      files: value === 'true'
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      financingType: prevState.financingType.includes(value)
        ? prevState.financingType.filter(item => item !== value)
        : [...prevState.financingType, value]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const accessToken = await getAccessTokenSilently();
        const url = `${import.meta.env.VITE_BACKEND_URL}/request`;
        const formDataObj = new FormData();

        for (const key in formData) {
            if (key === 'files' && formData[key].length > 0) {
                formData[key].forEach((file) => {
                  formDataObj.append('files', file, file.name);
                });
            } else if (Array.isArray(formData[key])) {
                formData[key].forEach((item, index) => {
                    formDataObj.append(`${key}[${index}]`, item);
                });
            } else if (formData[key] !== null && formData[key] !== undefined) {
                formDataObj.append(key, formData[key]);
            }
        }

        const response = await axios.post(url, formDataObj, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            }
        });

        alert('Solicitud creada con éxito! Revisa el estado de tus otras postulaciones en Mis Solicitudes');
        navigate('/MisSolicitudes');
    } catch (error) {
        alert('Error al hacer la solicitud. ' + error.response.data.message)
        console.error('Error submitting form:', error);
        if (error.response) {
            console.error('Server responded with:', error.response.data);
        } else if (error.request) {
            console.error('No response received:', error.request);
        } else {
            console.error('Error setting up request:', error.message);
        }
    }
};


  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <h2 className={styles.title}>Nueva Solicitud</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="purpose">
              Motivo del Viaje<span style={{ color: 'red' }}> *</span>
            </label>
            <select
              id="purpose"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione...</option>
              <option value="Asistencia a conferencia">Asistencia a conferencia</option>
              <option value="Visita de colaboración científica">Visita de colaboración científica</option>
              <option value="Pasantía breve">Pasantía breve</option>
              <option value="Invitación a Chile de un investigador/a internacional">
                Invitación a Chile de un investigador/a internacional
              </option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          
          {formData.purpose === 'Otro' && (
            <div className={styles.formGroup}>
              <label htmlFor="otherPurpose">
                Si su respuesta anterior fue "Otro" indique el motivo:<span style={{ color: 'red' }}> *</span>
              </label>
              <textarea
                id="otherPurpose"
                name="otherPurpose"
                value={formData.otherPurpose}
                onChange={handleChange}
                required
              ></textarea>
            </div>
          )}
          
          <div className={styles.formGroup}>
            <label htmlFor="resultingWork">
              Comente brevemente qué producto o tema relacionado a Cenia se obtendrá como resultado de este aporte pecuniario (publicación, convenio, colaboración, reunión con estudiantes, entre otros)
              <span style={{ color: 'red' }}> *</span>
            </label>
            <textarea
              id="resultingWork"
              name="resultingWork"
              value={formData.resultingWork}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="destination">
              Destino<span style={{ color: 'red' }}> *</span>
            </label>
            <input
              type="text"
              id="destination"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="startDate">
              Fecha de Inicio<span style={{ color: 'red' }}> *</span>
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="durationPeriod">
              Duración del Periodo<span style={{ color: 'red' }}> *</span>
            </label>
            <input
              type="text"
              id="durationPeriod"
              name="durationPeriod"
              value={formData.durationPeriod}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="financingType">
              Financiamiento Solicitado<span style={{ color: 'red' }}> *</span>
            </label>
            <div className={styles.checkboxGroup}>
              <label>
                <input
                  type="checkbox"
                  name="financingType"
                  value="Pasajes $1.200.000 pesos máximo para pasajes aéreos"
                  checked={formData.financingType.includes("Pasajes $1.200.000 pesos máximo para pasajes aéreos")}
                  onChange={handleCheckboxChange}
                />
                Pasajes $1.200.000 pesos máximo para pasajes aéreos
              </label>
              <label>
                <input
                  type="checkbox"
                  name="financingType"
                  value="Viáticos (alojamiento + alimentación) $100.000 a $150.000 pesos máximo diarios"
                  checked={formData.financingType.includes("Viáticos (alojamiento + alimentación) $100.000 a $150.000 pesos máximo diarios")}
                  onChange={handleCheckboxChange}
                />
                Viáticos (alojamiento + alimentación) $100.000 a $150.000 pesos máximo diarios
              </label>
              <label>
                <input
                  type="checkbox"
                  name="financingType"
                  value="Inscripción a conferencia"
                  checked={formData.financingType.includes("Inscripción a conferencia")}
                  onChange={handleCheckboxChange}
                />
                Inscripción a conferencia
              </label>
              <label>
                <input
                  type="checkbox"
                  name="financingType"
                  value="Otro"
                  checked={formData.financingType.includes("Otro")}
                  onChange={handleCheckboxChange}
                />
                Otro
              </label>
            </div>
          </div>
          
          {formData.financingType.includes('Otro') && (
            <div className={styles.formGroup}>
              <label htmlFor="otherFinancingType">
                Si seleccionó Otro, por favor describa<span style={{ color: 'red' }}> *</span>
              </label>
              <textarea
                id="otherFinancingType"
                name="otherFinancingType"
                value={formData.otherFinancingType}
                onChange={handleChange}
                required
              ></textarea>
            </div>
          )}
          
          <div className={styles.formGroup}>
            <label htmlFor="amountRequested">Monto requerido:</label>
            <input type="number" min={0} id="amountRequested" name="amountRequested" value={formData.amountRequested} onChange={handleChange}></input>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="outsideFinancing">
              ¿Estás postulando a otras fuentes de financiamiento?<span style={{ color: 'red' }}> *</span>
            </label>
            <div>
              <label>
                <input
                  type="radio"
                  id="outsideFinancingSi"
                  name="outsideFinancing"
                  value={true}
                  checked={formData.outsideFinancing === true}
                  onChange={handleRadioChange}
                  required
                />{' '}
                Sí<span style={{ color: 'red' }}> *</span>
              </label>
              <label>
                <input
                  type="radio"
                  id="outsideFinancingNo"
                  name="outsideFinancing"
                  value={false}
                  checked={formData.outsideFinancing === false}
                  onChange={handleRadioChange}
                  required
                />{' '}
                No<span style={{ color: 'red' }}> *</span>
              </label>
            </div>
          </div>
          
          {formData.outsideFinancing && (
            <div className={styles.formGroup}>
              <label htmlFor="outsideFinancingSponsors">
                ¿Cuáles?<span style={{ color: 'red' }}> *</span>
              </label>
              <textarea
                id="outsideFinancingSponsors"
                name="outsideFinancingSponsors"
                value={formData.outsideFinancingSponsors}
                onChange={handleChange}
                required
              ></textarea>
            </div>
          )}
          
          {formData.purpose === 'Asistencia a conferencia' && (
            <div>
              <div className={styles.formGroup}>
                <label htmlFor="conferenceName">
                  Nombre de la Conferencia<span style={{ color: 'red' }}> *</span>
                </label>
                <input
                  type="text"
                  id="conferenceName"
                  name="conferenceName"
                  value={formData.conferenceName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="conferenceRanking">
                  Ranking de la Conferencia (incluir fuente)<span style={{ color: 'red' }}> *</span>
                </label>
                <input
                  type="text"
                  id="conferenceRanking"
                  name="conferenceRanking"
                  value={formData.conferenceRanking}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="researchName">
                  Título del paper<span style={{ color: 'red' }}> *</span>
                </label>
                <input
                  type="text"
                  id="researchName"
                  name="researchName"
                  value={formData.researchName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="researchAbstract">
                  Abstract<span style={{ color: 'red' }}> *</span>
                </label>
                <textarea
                  id="researchAbstract"
                  name="researchAbstract"
                  value={formData.researchAbstract}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="acknowledgment">
                  El paper, ¿tiene acknowledgment Cenia?<span style={{ color: 'red' }}> *</span>
                </label>
                <div>
                  <label>
                    <input
                      type="radio"
                      id="acknowledgmentSi"
                      name="acknowledgment"
                      value="Sí"
                      checked={formData.acknowledgment === 'Sí'}
                      onChange={handleChange}
                      required
                    />{' '}
                    Sí<span style={{ color: 'red' }}> *</span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      id="acknowledgmentNo"
                      name="acknowledgment"
                      value="No"
                      checked={formData.acknowledgment === 'No'}
                      onChange={handleChange}
                      required
                    />{' '}
                    No<span style={{ color: 'red' }}> *</span>
                  </label>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="outsideAcknowledgment">
                  El paper, ¿tiene asociado otro centro o institución en sus acknowledgments o afiliaciones?<span style={{ color: 'red' }}> *</span>
                </label>
                <div>
                  <label>
                    <input
                      type="radio"
                      id="outsideAcknowledgmentSi"
                      name="outsideAcknowledgment"
                      value="Sí"
                      checked={formData.outsideAcknowledgment === 'Sí'}
                      onChange={handleChange}
                      required
                    />{' '}
                    Sí<span style={{ color: 'red' }}> *</span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      id="outsideAcknowledgmentNo"
                      name="outsideAcknowledgment"
                      value="No"
                      checked={formData.outsideAcknowledgment === 'No'}
                      onChange={handleChange}
                      required
                    />{' '}
                    No<span style={{ color: 'red' }}> *</span>
                  </label>
                </div>
              </div>

              {/* Conditional Field */}
              {formData.outsideAcknowledgment === 'Sí' && (
                <div className={styles.formGroup}>
                  <label htmlFor="outsideAcknowledgmentName">
                    Nombre del centro o institución aparte de Cenia que el paper tiene asociado<span style={{ color: 'red' }}> *</span>
                  </label>
                  <input
                    type="text"
                    id="outsideAcknowledgmentName"
                    name="outsideAcknowledgmentName"
                    value={formData.outsideAcknowledgmentName}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}
              
              <div className={styles.formGroup}>
                <label htmlFor="participationType">
                  Tipo de Participación<span style={{ color: 'red' }}> *</span>
                </label>
                <div>
                  <label>
                    <input
                      type="radio"
                      id="participationTypeMain"
                      name="participationType"
                      value="Main Track"
                      checked={formData.participationType === 'Main Track'}
                      onChange={handleChange}
                      required
                    />{' '}
                    Main Track<span style={{ color: 'red' }}> *</span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      id="participationTypeSide"
                      name="participationType"
                      value="Side Event"
                      checked={formData.participationType === 'Side Event'}
                      onChange={handleChange}
                      required
                    />{' '}
                    Side Event<span style={{ color: 'red' }}> *</span>
                  </label>
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="files">
                  Comprobante de Conferencia<span style={{ color: 'red' }}> *</span>
                </label>
                <input
                  type="file"
                  id="files"
                  name="files"
                  accept="image/*,application/pdf"
                  multiple 
                  onChange={handleFileChange}
                  required
                />
              </div>
              <div>
                {formData.files.map((file, index) => (
                  <div key={index}>
                    <span>{file.name}</span>
                    <button type="button" onClick={() => handleRemoveFile(index)}>
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <button type="submit">Enviar Solicitud</button>
        </form>
      </div>
    </div>
  );


};

export default NuevaSolicitud;
