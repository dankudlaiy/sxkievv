// src/components/Input/Input.jsx

import React, { useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import styles from './Input.module.sass';

const Input = ({
                  placeholder = '',
                  type = 'text',
                  value = '',
                  required = false,
                  title,
                  changeState,
                  ...props
               }) => {
   // We use one ref for files in different modes
   const fileInputRef = useRef(null);

   // ─────────────────────────────────────────────────────────────────
   // 1) VIDEO MODE (single video)
   // ─────────────────────────────────────────────────────────────────
   if (type === 'video') {
      // For video, value is a single File or null
      const videoFile = value instanceof File ? value : null;

      const handleClick = () => {
         if (fileInputRef.current) {
            fileInputRef.current.click();
         }
      };

      const onFileChange = (e) => {
         const selectedFiles = e.target.files;
         if (selectedFiles && selectedFiles[0]) {
            const file = selectedFiles[0];
            // Accept only videos
            if (file.type.startsWith('video/')) {
               changeState(file);
            }
         }
         e.target.value = null; // reset so user can select the same file again if desired
      };

      return (
         <div className={styles.container}>
            <label className={required ? styles.required : ''}>
               {title}
            </label>

            {/* Clickable box for selecting a single video */}
            <div
               className={styles.dragArea}
               onClick={handleClick}
               style={{
                  border: '2px dashed #ccc',
                  borderRadius: '8px',
                  padding: '20px',
                  textAlign: 'center',
                  cursor: 'pointer',
               }}
            >
               {videoFile ? (
                  <>
                     <p>{videoFile.name}</p>
                     <p style={{ fontStyle: 'italic', marginTop: '5px' }}>
                        Нажмите, чтобы выбрать другое видео
                     </p>
                  </>
               ) : (
                  <p>{placeholder}</p>
               )}
            </div>

            {/* Hidden file input */}
            <input
               ref={fileInputRef}
               type="file"
               accept="video/*"
               onChange={onFileChange}
               style={{ display: 'none' }}
            />
         </div>
      );
   }

   // ─────────────────────────────────────────────────────────────────
   // 2) PHOTOS MODE (multiple images with reorder)
   // ─────────────────────────────────────────────────────────────────
   if (type === 'photos') {
      // We expect value to be an array of Files for photos
      const photos = Array.isArray(value) ? value : [];

      // reorder helper
      const reorder = (list, startIndex, endIndex) => {
         const result = Array.from(list);
         const [removed] = result.splice(startIndex, 1);
         result.splice(endIndex, 0, removed);
         return result;
      };

      const onDragEnd = (result) => {
         if (!result.destination) return;
         const newOrder = reorder(
            photos,
            result.source.index,
            result.destination.index
         );
         changeState(newOrder);
      };

      const handleFiles = (fileList) => {
         const validFiles = [];
         for (const file of fileList) {
            if (file.type.startsWith('image/')) {
               validFiles.push(file);
            }
         }
         if (validFiles.length > 0) {
            changeState([...photos, ...validFiles]);
         }
      };

      const handleClick = () => {
         if (fileInputRef.current) {
            fileInputRef.current.click();
         }
      };

      const onFileChange = (e) => {
         handleFiles(e.target.files);
         e.target.value = null;
      };

      const onDrop = (e) => {
         e.preventDefault();
         e.stopPropagation();
         if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
         }
      };

      const onDragOver = (e) => {
         e.preventDefault();
         e.stopPropagation();
      };

      const removePhoto = (index) => {
         const updated = [...photos];
         updated.splice(index, 1);
         changeState(updated);
      };

      return (
         <div className={styles.container}>
            <label className={required ? styles.required : ''}>
               {title}
            </label>

            {/* DRAG / CLICK AREA */}
            <div
               className={styles.dragArea}
               onClick={handleClick}
               onDrop={onDrop}
               onDragOver={onDragOver}
               style={{
                  border: '2px dashed #ccc',
                  borderRadius: '8px',
                  padding: '20px',
                  textAlign: 'center',
                  cursor: 'pointer',
               }}
            >
               <p>{placeholder}</p>
            </div>

            {/* Hidden file input */}
            <input
               ref={fileInputRef}
               type="file"
               multiple
               accept="image/*"
               onChange={onFileChange}
               style={{ display: 'none' }}
            />

            {/* IMAGE PREVIEWS + DRAG/REORDER */}
            <DragDropContext onDragEnd={onDragEnd}>
               <Droppable droppableId="photos" direction="horizontal">
                  {(provided) => (
                     <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={styles.photosContainer}
                        style={{
                           display: 'flex',
                           flexWrap: 'wrap',
                           gap: '10px',
                           marginTop: '10px',
                        }}
                     >
                        {photos.map((file, index) => {
                           const previewUrl = URL.createObjectURL(file);
                           return (
                              <Draggable
                                 key={index.toString()}
                                 draggableId={`photo-${index}`}
                                 index={index}
                              >
                                 {(provided) => (
                                    <div
                                       ref={provided.innerRef}
                                       {...provided.draggableProps}
                                       {...provided.dragHandleProps}
                                       style={{
                                          width: '100px',
                                          height: '100px',
                                          position: 'relative',
                                          border: '1px solid #ccc',
                                          borderRadius: '4px',
                                          overflow: 'hidden',
                                          ...provided.draggableProps.style,
                                       }}
                                    >
                                       <img
                                          src={previewUrl}
                                          alt={`Photo ${index}`}
                                          style={{
                                             width: '100%',
                                             height: '100%',
                                             objectFit: 'cover',
                                          }}
                                       />
                                       {/* Remove button */}
                                       <button
                                          type="button"
                                          onClick={(e) => {
                                             e.stopPropagation();
                                             removePhoto(index);
                                          }}
                                          style={{
                                             position: 'absolute',
                                             top: '5px',
                                             right: '5px',
                                             backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                             color: '#fff',
                                             border: 'none',
                                             borderRadius: '50%',
                                             width: '20px',
                                             height: '20px',
                                             cursor: 'pointer',
                                          }}
                                       >
                                          x
                                       </button>
                                    </div>
                                 )}
                              </Draggable>
                           );
                        })}
                        {provided.placeholder}
                     </div>
                  )}
               </Droppable>
            </DragDropContext>
         </div>
      );
   }

   // ─────────────────────────────────────────────────────────────────
   // 3) SELECT MODE (props.options is an array)
   // ─────────────────────────────────────────────────────────────────
   if (props.options && Array.isArray(props.options)) {
      const handleSelectChange = (e) => {
         changeState(e.target.value);
      };

      return (
         <div className={styles.container}>
            <label className={required ? styles.required : ''}>
               {title}
            </label>
            <select
               value={value}
               onChange={handleSelectChange}
               required={required}
               {...props}
            >
               {props.options.map((option, idx) => (
                  <option key={idx} value={option}>
                     {option}
                  </option>
               ))}
            </select>
         </div>
      );
   }

   // ─────────────────────────────────────────────────────────────────
   // 4) DEFAULT TEXT / TEXTAREA
   // ─────────────────────────────────────────────────────────────────
   const onChange = (e) => {
      e.preventDefault();
      changeState(e.target.value);
   };

   // Textarea
   if (props.rows) {
      return (
         <div className={styles.container}>
            <label className={required ? styles.required : ''}>
               {title}
            </label>
            <textarea
               rows={props.rows}
               onChange={onChange}
               placeholder={placeholder}
               value={value}
               required={required}
               {...props}
            />
         </div>
      );
   }

   // Standard input
   return (
      <div className={styles.container}>
         <label className={required ? styles.required : ''}>
            {title}
         </label>
         <input
            type={type}
            onChange={onChange}
            placeholder={placeholder}
            value={value}
            required={required}
            {...props}
         />
      </div>
   );
};

export default Input;
