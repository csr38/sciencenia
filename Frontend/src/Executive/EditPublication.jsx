import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import styles from '../styles/Form.module.css';
import Navbar from "../Commons/Navbar";
import LoadingSpinner from "../Commons/LoadingSpinner";
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function EditPublication() {
  const { isLoading, user, getAccessTokenSilently } = useAuth0();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [publication, setPublication] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [loadingRole, setLoadingRole] = useState(true);


  useEffect(() => {
    const fetchPublicationData = async () => {
      if (!isLoading && user && id) {
        try {
          const accessToken = await getAccessTokenSilently();
          const url = `${import.meta.env.VITE_BACKEND_URL}/research/getById/${id}`;
          const response = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });
          const publicationData = response.data;
          setPublication(publicationData); 
          setLoading(false);
        } catch (error) {
          console.error('Error fetching publication data:', error);
          setLoading(false);
        }
      }
    };

    fetchPublicationData();
  }, [isLoading, user, getAccessTokenSilently, id]);


  const onSubmit = async (data) => {
    try {
      const accessToken = await getAccessTokenSilently();
      await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/research/${publication.id}`, {
        title: data.title,
        doi: data.doi,
        link: data.link,
        year: data.year,
        month: data.month,
        firstPage: data.firstPage,
        lastPage: data.lastPage,
        notes: data.notes
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      navigate(-1); 
    } catch (error) {
      console.error('Error updating publication:', error);
    }
  };


  if (isLoading || loading) {
    return <LoadingSpinner />;
  }


  return (!isLoading && !loading) && (
    <div className={styles.background}>
      <Navbar />
      <div className={styles.editInvestigatorProfileFormContainer}>
        <h2 className="form-title">Editar Publicación</h2>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.infoForm}>
          <div className={styles.formColumnsContainer}>
            {/* First column of form inputs */}
            <div className={styles.formColumn}>
              <div className={styles.formGroup}>
                <label htmlFor="title">Título <span className="required">{errors.title && "*Obligatorio"}</span></label>
                <input type="text" id="title" {...register('title', { required: true })} defaultValue={publication?.title ?? ''} />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="doi">DOI <span className="required">{errors.doi && "*Obligatorio"}</span></label>
                <input type="text" id="doi" {...register('doi', { required: true })} defaultValue={publication?.doi ?? ''} />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="link">Link <span className="required">{errors.link && "*Obligatorio"}</span></label>
                <input type="text" id="link" {...register('link', { required: true })} defaultValue={publication?.link ?? ''} />
              </div>
            </div>
            {/* Second column of form inputs */}
            <div className={styles.formColumn}>
              <div className={styles.formGroup}>
                <label htmlFor="month">Mes de publicación <span className="required">{errors.month && "*Obligatorio"}</span></label>
                <select id="month" {...register('month', { required: true })} defaultValue={publication?.month ?? ''}>
                  <option value="">Selecciona un mes</option>
                  <option value="Enero">Enero</option>
                  <option value="Febrero">Febrero</option>
                  <option value="Marzo">Marzo</option>
                  <option value="Abril">Abril</option>
                  <option value="Mayo">Mayo</option>
                  <option value="Junio">Junio</option>
                  <option value="Julio">Julio</option>
                  <option value="Agosto">Agosto</option>
                  <option value="Septiembre">Septiembre</option>
                  <option value="Octubre">Octubre</option>
                  <option value="Noviembre">Noviembre</option>
                  <option value="Diciembre">Diciembre</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="year">Año de publicación <span className="required">{errors.year && "*Obligatorio"}</span></label>
                <input type="number" id="year" {...register('year', { required: true })} defaultValue={publication?.year ?? 0} />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="firstPage">Primera Página <span className="required">{errors.firstPage && "*Obligatorio"}</span></label>
                <input type="number" id="firstPage" {...register('firstPage', { required: true })} defaultValue={publication?.firstPage ?? 0} />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="lastPage">Última Página <span className="required">{errors.lastPage && "*Obligatorio"}</span></label>
                <input type="number" id="lastPage" {...register('lastPage', { required: true })} defaultValue={publication?.lastPage ?? 0} />
              </div>
            </div>
            {/* Third column of form inputs */}
            <div className={styles.formColumn}>
              <div className={styles.formGroup}>
                <label htmlFor="notes">Notas <span className="required">{errors.notes && "*Obligatorio"}</span></label>
                <textarea id="notes" {...register('notes', { required: true })} defaultValue={publication?.notes ?? ''} />
              </div>
            </div>
          </div>
          <button type="submit" className="submit-button">Actualizar</button>
        </form>
      </div>
    </div>
  );
}

export default EditPublication;
