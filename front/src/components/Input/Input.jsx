import React, {useRef} from 'react'
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd'
import styles from './Input.module.sass'
import clsx from "clsx"

const Input = ({
                  placeholder = '',
                  type = 'text',
                  value = '',
                  required = false,
                  title,
                  changeState,
                  name = '',
                  ...props
               }) => {

   // We use one ref for files in different modes
   const fileInputRef = useRef(null)

   const onChange = (e) => {
      e.preventDefault()
      changeState(e.target.value)
   }

   const error_el = props.error && <p className={styles.errorMessage}>{props.error}</p>
   const title_el = (
      <label className={required ? styles.required : ''}>
         {title}
      </label>
   )

   const input_class = clsx(styles.input, {[styles.invalid]: props.error})


   // ─────────────────────────────────────────────────────────────────
   // 1) VIDEO MODE (single video)
   // ─────────────────────────────────────────────────────────────────
   if (type === 'video') {
      // value can be:
      // 1) A File object (newly selected video)
      // 2) An object { url: "/uploads/xxx.mp4", fromServer: true }
      // 3) Or null/empty if no video selected
      const isFile = value instanceof File;
      const isServerVideo = value && typeof value === 'object' && value.fromServer;

      // Extract the "display name" for the video
      let videoName = null;

      if (isFile) {
         // A newly selected file
         videoName = value.name;
      } else if (isServerVideo) {
         // Existing server video => parse filename from the URL
         const parts = value.url.split('/');
         videoName = parts[parts.length - 1];
         // e.g. "2025-03-21 07-52-51.mp4"
      }

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
               changeState(file); // This updates your `values.video` to the new File
            }
         }
         e.target.value = null; // reset so user can select the same file again if desired
      };

      return (
         <div className={styles.container}>
            {title_el}

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
               {videoName ? (
                  <>
                     <p>{videoName}</p>
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
               className={input_class}
               ref={fileInputRef}
               type="file"
               accept="video/*"
               onChange={onFileChange}
               style={{ display: 'none' }}
               name={name}
            />

            {error_el}
         </div>
      );
   }


   // ─────────────────────────────────────────────────────────────────
   // 2) PHOTOS MODE (multiple images with reorder)
   // ─────────────────────────────────────────────────────────────────
   if (type === 'photos') {
      // We expect value to be an array of Files for photos
      const photos = Array.isArray(value) ? value : []

      // reorder helper
      const reorder = (list, startIndex, endIndex) => {
         const result = Array.from(list)
         const [removed] = result.splice(startIndex, 1)
         result.splice(endIndex, 0, removed)
         return result
      }

      const onDragEnd = (result) => {
         if (!result.destination) return
         const newOrder = reorder(
            photos,
            result.source.index,
            result.destination.index
         )
         changeState(newOrder)
      }

      const handleFiles = (fileList) => {
         const validFiles = []
         for (const file of fileList) {
            if (file.type.startsWith('image/')) {
               validFiles.push(file)
            }
         }
         if (validFiles.length > 0) {
            changeState([...photos, ...validFiles])
         }
      }

      const handleClick = () => {
         if (fileInputRef.current) {
            fileInputRef.current.click()
         }
      }

      const onFileChange = (e) => {
         handleFiles(e.target.files)
         e.target.value = null
      }

      const onDrop = (e) => {
         e.preventDefault()
         e.stopPropagation()
         if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files)
         }
      }

      const onDragOver = (e) => {
         e.preventDefault()
         e.stopPropagation()
      }

      const removePhoto = (index) => {
         const updated = [...photos]
         updated.splice(index, 1)
         changeState(updated)
      }

      function getPreviewURL(item) {
         // If it's an actual File object:
         if (item instanceof File) {
            return URL.createObjectURL(item);
         }
         // If it's an object from the server (with a .url property):
         if (typeof item === "object" && item.fromServer) {
            return item.url;
         }
         // If it's just a string path (server URL):
         if (typeof item === "string") {
            return item;
         }
         return ""; // fallback
      }


      return (
         <div className={styles.container}>
            {title_el}

            {/* DRAG / CLICK AREA */}
            <div
               className={styles.dragArea}
               onClick={handleClick}
               onDrop={onDrop}
               onDragOver={onDragOver}
               style={{
                  border      : '2px dashed #ccc',
                  borderRadius: '8px',
                  padding     : '20px',
                  textAlign   : 'center',
                  cursor      : 'pointer',
                  width: '20%'
               }}
            >
               <p>{placeholder}</p>
            </div>

            {/* Hidden file input */}
            <input
               className={input_class}
               ref={fileInputRef}
               type="file"
               multiple
               accept="image/*"
               onChange={onFileChange}
               style={{display: 'none'}}
               name={name}
            />

            {/* IMAGE PREVIEWS + DRAG/REORDER */}
            <DragDropContext onDragEnd={onDragEnd}>
               <Droppable droppableId="photos" direction="horizontal">
                  {(provided) => (
                     <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={styles.photosContainer}
                        name={name}
                        style={{
                           display  : 'flex',
                           flexWrap : 'wrap',
                           gap      : '10px',
                           marginTop: '10px',
                        }}
                     >
                        {photos.map((file, index) => {
                           const previewUrl = getPreviewURL(file)

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
                                          width       : '100px',
                                          height      : '100px',
                                          position    : 'relative',
                                          border      : '1px solid #ccc',
                                          borderRadius: '4px',
                                          overflow    : 'hidden',
                                          ...provided.draggableProps.style,
                                       }}
                                    >
                                       <img
                                          src={previewUrl}
                                          alt={`Photo ${index}`}
                                          style={{
                                             width    : '100%',
                                             height   : '100%',
                                             objectFit: 'cover',
                                          }}
                                       />
                                       {/* Remove button */}
                                       <button
                                          type="button"
                                          onClick={(e) => {
                                             e.stopPropagation()
                                             removePhoto(index)
                                          }}
                                          style={{
                                             position       : 'absolute',
                                             top            : '5px',
                                             right          : '5px',
                                             backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                             color          : '#fff',
                                             border         : 'none',
                                             borderRadius   : '50%',
                                             width          : '20px',
                                             height         : '20px',
                                             cursor         : 'pointer',
                                          }}
                                       >
                                          x
                                       </button>
                                    </div>
                                 )}
                              </Draggable>
                           )
                        })}
                        {provided.placeholder}
                     </div>
                  )}
               </Droppable>
            </DragDropContext>

            {props.error && <div style={{bottom: '-10px'}} >{error_el}</div>}
         </div>
      )
   }

   // ─────────────────────────────────────────────────────────────────
   // 3) SELECT MODE (props.options is an array)
   // ─────────────────────────────────────────────────────────────────
   if (props.options && Array.isArray(props.options)) {
      const handleSelectChange = (e) => {
         changeState(e.target.value)
      }

      return (
         <div className={styles.container}>
            {title_el}

            <select
               value={value}
               onChange={handleSelectChange}
               required={required}
               name={name}
               {...props}
            >
               {props.options.map((option, idx) => (
                  <option key={idx} value={option}>
                     {option}
                  </option>
               ))}
            </select>

            {error_el}
         </div>
      )
   }

   // ─────────────────────────────────────────────────────────────────
   // 4) RADIO/CHECK BUTTONS MODE (props.radios is an array)
   //    (We can select multiple items with custom styling)
   // ─────────────────────────────────────────────────────────────────
   if (props.radios && Array.isArray(props.radios)) {
      // We assume 'value' is an array of selected strings
      const selectedValues = Array.isArray(value) ? value : []

      // Toggle an item in selectedValues
      const toggleItem = (item) => {
         let updated = [...selectedValues]
         if (updated.includes(item)) {
            // Remove
            updated = updated.filter((val) => val !== item)
         } else {
            // Add
            updated.push(item)
         }
         changeState(updated)
      }

      // We'll display them 2 per row with an HTML table
      // chunk the radios array into pairs
      const chunkedRadios = []
      for (let i = 0; i < props.radios.length; i += 2) {
         chunkedRadios.push(props.radios.slice(i, i + 2))
      }

      return (
         <div className={styles.container} style={{marginTop: '10px'}} >
            {title_el}

            <table className={styles.radio_table} name={name}>
               <tbody>
               {chunkedRadios.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                     {row.map((item, colIndex) => {
                        const isSelected = selectedValues.includes(item)

                        return (
                           <td key={colIndex} className={styles.radio_container}>
                              <div
                                 className={clsx(styles.radio_btn, {[styles.selected]: isSelected})}
                                 onClick={() => toggleItem(item)}
                              >
                                 {item}
                              </div>
                           </td>
                        )
                     })}
                  </tr>
               ))}
               </tbody>
            </table>

            {error_el}
         </div>
      )
   }

   // ─────────────────────────────────────────────────────────────────
   // 5) PHONE INPUT
   // ─────────────────────────────────────────────────────────────────
   if (type === "tel") {
      return (
         <div className={styles.container}>
            {title_el}

            <input
               type="tel"
               placeholder={placeholder}
               required={required}
               onChange={onChange}
               value={value}
               className={input_class}
               name={name}
            />

            {error_el}
         </div>
      )
   }

   // ─────────────────────────────────────────────────────────────────
   // 6) DEFAULT TEXT / TEXTAREA
   // ─────────────────────────────────────────────────────────────────

   // Textarea
   if (props.rows) {
      return (
         <div className={styles.container}>
            {title_el}

            <textarea
               rows={props.rows}
               className={input_class}
               onChange={onChange}
               placeholder={placeholder}
               value={value}
               required={required}
               {...props}
               name={name}
            />

            {error_el}
         </div>
      )
   }

   // Standard input
   return (
      <div className={styles.container}>
         {title_el}

         <input
            className={input_class}
            type={type}
            onChange={onChange}
            placeholder={placeholder}
            value={value}
            required={required}
            {...props}
            name={name}
         />

         {error_el}
      </div>
   )
}

export default Input
