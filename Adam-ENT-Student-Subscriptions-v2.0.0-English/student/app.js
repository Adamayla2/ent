// ============================================================
//  ENT MASTER BANK — PRODUCTION OPTIMIZED BUILD v7.0
//  Performance Engineering: Dashboard Cache, Lazy Loading,
//  Virtual Scrolling, Infinite Scrolling, Smart Scroll Loader,
//  In-Memory Search Index, Filter Cache, Web Worker Offload
// ============================================================

window.ENTApp=window.ENTApp||{};
window.ENTApp.state=window.ENTApp.state||{};
window.ENTApp.utils=window.ENTApp.utils||{};

window.ENTApp=window.ENTApp||{};
window.ENTApp.modules=window.ENTApp.modules||{};
window.ENTApp.modules.app=window.ENTApp.modules.app||{};
window.ENTApp=window.ENTApp||{};
window.ENTApp.version='step36-opt';
window.ENTApp.utils=window.ENTApp.utils||{};
// Phase 5 bootstrap
window.ENTApp = window.ENTApp || {};
window.ENTApp.version='step35-opt';

        // ============================================================
        //  ENT CURRICULUM — subjects + chapters
        // ============================================================
        const ENT_DATA = {
            'Rhinology': [
                'Anatomy of the nose and paranasal sinuses', 'Outpatient assessment', 'Physiology of the nose and paranasal sinuses',
                'Measurement of the nasal airway', 'Allergic rhinitis', 'Non‑allergic perennial rhinitis', 'Occupational rhinitis',
                'Rhinosinusitis: Definitions, classification and diagnosis', 'Nasal polyposis', 'Fungal rhinosinusitis',
                'Medical management for rhinosinusitis', 'Surgical management of rhinosinusitis', 'The frontal sinus',
                'Mucoceles of the paranasal sinuses', 'Complications of rhinosinusitis', 'The relationship between the upper and lower respiratory tract',
                'Nasal septum and nasal valve', 'Nasal septal perforations', 'Management of enlarged turbinates', 'Epistaxis',
                'Nasal and facial fractures', 'CSF leaks', 'Granulomatous conditions of the nose', 'Abnormalities of smell',
                'Disorders of the orbit', 'Diagnosis and management of facial pain', 'Juvenile angiofibroma',
                'Endoscopic management of sinonasal tumours', 'Surgical management of pituitary and paraseptal diseases',
                'Extended anterior skull base approaches', 'Imaging in rhinology', 'Acute infection in case of maxillary sinusitis'
            ],
            'Paediatric ENT': [
                'Introduction to paediatric otorhinolaryngology', 'The paediatric consultation', 'Recognition and management of the sick child',
                'Anaesthesia for paediatric otorhinolaryngology procedures', 'The child with special needs', 'The child with a syndrome',
                'Management of the immunodeficient child', 'Hearing screening and surveillance', 'Hearing tests in children',
                'Management of the hearing impaired child', 'Paediatric implantation otology', 'Congenital middle ear abnormalities',
                'Otitis media with effusion', 'Acute otitis media', 'Chronic otitis media (paediatric)', 'Microtia and external ear abnormalities',
                'Disorders of speech and language', 'Cleft lip and palate', 'Craniofacial surgery', 'Balance disorders in children',
                'Facial paralysis in children', 'Neonatal nasal obstruction', 'Paediatric rhinosinusitis and its complications',
                'Lacrimal disorders in children', 'The adenoid and adenoidectomy', 'Paediatric obstructive sleep apnoea', 'Stridor',
                'Acute laryngeal infections (paediatric)', 'Congenital disorders of the larynx, trachea and bronchi',
                'Acquired laryngotracheal stenosis (paediatric)', 'Juvenile‑onset recurrent respiratory papillomatosis',
                'Paediatric voice disorders', 'Foreign bodies in the ear, nose and throat', 'Paediatric tracheostomy',
                'Perinatal airway management', 'Cervicofacial infections', 'Diseases of tonsils, tonsillectomy and tonsillotomy',
                'Salivary glands (paediatric)', 'Tumours of the head and neck in childhood', 'Cysts and sinuses of the head and neck',
                'Haemangiomas and vascular malformations', 'Drooling and aspiration', 'Reflux and eosinophilic oesophagitis (paediatric)',
                'Oesophageal disorders in children'
            ],
            'Otology': [
                'Anatomy and embryology of the external and middle ear', 'Anatomy of the cochlea and vestibular system: relating ultrastructure to function',
                'Physiology of hearing', 'Physiology of equilibrium', 'Perception of sounds at the auditory cortex', 'Psychoacoustic audiometry',
                'Evoked measurement of auditory sensitivity', 'Prevention of hearing loss', 'Hearing aids',
                'Beyond hearing aids: an overview of adult audiological rehabilitation', 'Age‑related sensorineural hearing impairment',
                'Noise‑induced hearing loss and related conditions', 'Autosomal dominant non‑syndromic sensorineural hearing loss',
                'Ototoxicity', 'Idiopathic sudden sensorineural hearing loss', 'Tinnitus and hyperacusis', 'Evaluation of balance',
                'Meniere\'s disease', 'Benign paroxysmal positional vertigo', 'Superior semicircular canal dehiscence', 'Vestibular neuritis',
                'Vestibular migraine', 'Vestibular rehabilitation', 'Auditory neuropathy spectrum disorder and retrocochlear disorders in adults and children',
                'Understanding tinnitus: a psychological perspective', 'Auditory processing disorders across the age span',
                'Neuropsychiatric aspects of vestibular disorders', 'Clinical examination of the ears and hearing', 'Furunculosis', 'Myringitis',
                'Keratosis obturans, primary auditory canal cholesteatoma and benign necrotizing otitis externa', 'Acquired atresia of the external ear',
                'Otitis externa and otomycosis', 'Perichondritis of the external ear', 'Exostosis of the external auditory canal',
                'Osteoradionecrosis of the temporal bone', 'Acute otitis media and otitis media with effusion in adults', 'Myringoplasty',
                'Ossiculoplasty', 'Eustachian tube dysfunction', 'Otoendoscopy', 'Tuberculosis of the temporal bone', 'Otosclerosis',
                'Otological effects of Paget\'s disease', 'Ear trauma', 'Otalgia', 'Bone‑conduction hearing devices', 'Cochlear implants',
                'Middle ear implants', 'Auditory brainstem implantation', 'Imaging of the temporal bone'
            ],
            'Skull Base': [
                'Anatomy of the skull base and infratemporal fossa', 'Evaluation of the skull base patient', 'Vascular assessment and management',
                'Natural history of vestibular schwannomas', 'Surgical management of vestibular schwannoma', 'Stereotactic radiosurgery',
                'Neurofibromatosis 2', 'Non‑vestibular schwannoma tumours of the cerebellum‑pontine angle', 'Middle fossa surgery',
                'Jugular foramen lesions and their management', 'Petrous apex lesions', 'Approaches to the nasopharynx and Eustachian tube',
                'Tumours of the temporal bone', 'Clinical neuroanatomy', 'The facial nerve and its non‑neoplastic disorders',
                'Tumours of the facial nerve', 'Osteitis of the temporal bone', 'Squamous cell carcinoma of the temporal bone',
                'Complications of skull base surgery'
            ],
            'Laryngology & Voice': [
                'Physiology of the salivary glands', 'Phonosurgery', 'Movement disorders of the larynx',
                'Chronic laryngitis', 'Contemporary management of laryngotracheal trauma', 'Upper airway obstruction and tracheostomy',
                'Physiology of sleep and sleep disorders', 'Obstructive sleep apnoea: Medical management (adult)',
                'The surgical management of snoring and obstructive sleep apnoea', 'Laryngotracheal stenosis in adults', 'Reflux disease (adult)',
                'Paralysis of the larynx', 'Outpatient laryngeal procedures', 'Anatomy of the larynx and tracheobronchial tree',
                'Physiology of the larynx', 'Voice and speech production', 'Assessment and examination of the larynx', 'Evaluation of the voice',
                'Structural disorders of the vocal cords', 'Functional disorders of the voice', 'The professional voice',
                'Speech and language therapy for voice disorders', 'Acute infections of the larynx (general)'
            ],
            'Facial Plastic & Reconstructive': [
                'Rhinoplasty following nasal trauma', 'Pre‑operative assessment for rhinoplasty', 'External rhinoplasty', 'Revision rhinoplasty',
                'Aesthetic dorsal reduction rhinoplasty', 'Nasal reconstruction', 'Pinnaplasty', 'Blepharoplasty',
                'Surgical rejuvenation of the ageing face', 'Non‑surgical rejuvenation of the ageing face'
            ],
            'Head & Neck Surgery': [
                'History of reconstructive surgery', 'Grafts and local flaps in head and neck cancer', 'Pedicled flaps in head and neck reconstruction',
                'Reconstructive microsurgery in head and neck surgery', 'Benign and malignant conditions of the skin', 'Facial reanimation surgery',
                'Partial and total ear reconstruction', 'A combined prosthetic and surgical approach', 'Oral cavity tumours including lip reconstruction',
                'Oropharyngeal tumours', 'Tumours of the larynx', 'Head and neck pathology', 'Applications of robotics in head and neck practice',
                'Biologically targeted agents in head and neck cancers', 'Prosthetic management of surgically acquired oral and facial defects',
                'Multidisciplinary team working', 'Nutritional considerations', 'Speech voice and swallow rehabilitation after chemoradiation',
                'Surgical anatomy of the neck', 'Clinical examination of the neck', 'Imaging of the neck', 'Neck trauma', 'Benign neck disease',
                'Neck space infections', 'Anatomy and embryology of the mouth and dentition', 'Benign oral and dental disease',
                'Salivary gland anatomy', 'Imaging of the salivary glands', 'Non‑neoplastic salivary gland diseases', 'Pharyngitis',
                'Cricopharyngeal dysphagia', 'Oesophageal diseases (adult)', 'Neurological disease of the pharynx',
                'Rehabilitation of swallowing disorders', 'Chronic aspiration', 'Temporomandibular joint disorders'
            ],
            'Swallowing & Dysphagia': [
                'Anatomy of the pharynx and oesophagus', 'Physiology of swallowing', 'Causes and assessment of dysphagia and aspiration',
                'Functional investigations of the upper gastrointestinal tract'
            ]
        };

        // ============================================================
        //  SCOTT-BROWN TAXONOMY (new classification, replaces ENT_DATA
        //  as the primary structure going forward)
        //  Hierarchy: Subject -> Part (only where Scott-Brown has Parts)
        //             -> Chapter
        //
        //  Source of truth: 8 photos of the official Scott-Brown Table of
        //  Contents (Volumes 1-2), read chapter-by-chapter and verified
        //  twice against the images - page-boundary chapters appeared in
        //  two overlapping photos each, giving a natural double-check.
        //  All 9 subjects and all 252 chapters are now fully populated;
        //  nothing here is pending or guessed. One title (chapter 224,
        //  "Prosthetics: Facial prosthetic – Rehabilitation") has a dash
        //  character that was hard to pin down at photo resolution and
        //  may be worth confirming against the source page; everything
        //  else was legible with high confidence.
        //
        //  chapterNumber is the GLOBAL Scott-Brown chapter number
        //  (1-252), continuous across the whole book - never reset per
        //  subject or Part. Verified section boundaries: Otology 1-40,
        //  Lateral Skull Base 41-57, Rhinology 58-82, Anterior Skull
        //  Base 83-101, Facial Plastic Surgery 102-121, Paediatrics
        //  122-152, Laryngology 153-182, Head and Neck 183-226 (its 8
        //  Parts span 183-190/191-200/201-204/205-207/208-211/212-213/
        //  214-216/217-226), Head and Neck Endocrine 227-252.
        //
        //  Designed for future multi-book scalability: each entry could be
        //  nested under a `book`/`volume` envelope later without changing
        //  this shape (see CLASSIFICATION_BOOKS below).
        // ============================================================
        const SCOTT_BROWN_TAXONOMY = [
            {
                subjectId: 'otology', subject: 'Otology', pending: false, parts: null,
                chapters: [
                    { chapterId: 'sb_otology_01', chapterNumber: 1, chapter: 'Physiology of hearing' },
                    { chapterId: 'sb_otology_02', chapterNumber: 2, chapter: 'Physiology and assessment of balance' },
                    { chapterId: 'sb_otology_03', chapterNumber: 3, chapter: 'Hearing tests' },
                    { chapterId: 'sb_otology_04', chapterNumber: 4, chapter: 'Prevention of hearing loss' },
                    { chapterId: 'sb_otology_05', chapterNumber: 5, chapter: 'Age-related sensorineural hearing impairment' },
                    { chapterId: 'sb_otology_06', chapterNumber: 6, chapter: 'Noise-induced hearing loss and related conditions' },
                    { chapterId: 'sb_otology_07', chapterNumber: 7, chapter: 'Single-sided deafness' },
                    { chapterId: 'sb_otology_08', chapterNumber: 8, chapter: 'Auditory neuropathy spectrum disorder and retrocochlear disorders in adults and children' },
                    { chapterId: 'sb_otology_09', chapterNumber: 9, chapter: 'Tinnitus and hyperacusis' },
                    { chapterId: 'sb_otology_10', chapterNumber: 10, chapter: 'Ménière\'s disease' },
                    { chapterId: 'sb_otology_11', chapterNumber: 11, chapter: 'Benign paroxysmal positional vertigo' },
                    { chapterId: 'sb_otology_12', chapterNumber: 12, chapter: 'Superior semi-circular canal dehiscence' },
                    { chapterId: 'sb_otology_13', chapterNumber: 13, chapter: 'Vestibular neuritis' },
                    { chapterId: 'sb_otology_14', chapterNumber: 14, chapter: 'Vestibular migraine' },
                    { chapterId: 'sb_otology_15', chapterNumber: 15, chapter: 'Vestibular rehabilitation' },
                    { chapterId: 'sb_otology_16', chapterNumber: 16, chapter: 'Auditory processing disorder across the age span' },
                    { chapterId: 'sb_otology_17', chapterNumber: 17, chapter: 'Neuropsychiatric aspects of vestibular disorders' },
                    { chapterId: 'sb_otology_18', chapterNumber: 18, chapter: 'Anatomy and embryology of the external and middle ear' },
                    { chapterId: 'sb_otology_19', chapterNumber: 19, chapter: 'Anatomy of the cochlea and vestibular system: Relating ultrastructure to function' },
                    { chapterId: 'sb_otology_20', chapterNumber: 20, chapter: 'Clinical examination of the ears and hearing' },
                    { chapterId: 'sb_otology_21', chapterNumber: 21, chapter: 'Endoscopic ear surgery' },
                    { chapterId: 'sb_otology_22', chapterNumber: 22, chapter: 'Otalgia' },
                    { chapterId: 'sb_otology_23', chapterNumber: 23, chapter: 'Perichondritis of the external ear' },
                    { chapterId: 'sb_otology_24', chapterNumber: 24, chapter: 'Acquired atresia and exostosis of the external ear' },
                    { chapterId: 'sb_otology_25', chapterNumber: 25, chapter: 'Otitis externa and necrotising otitis externa' },
                    { chapterId: 'sb_otology_26', chapterNumber: 26, chapter: 'Keratosis obturans and external auditory canal cholesteatoma' },
                    { chapterId: 'sb_otology_27', chapterNumber: 27, chapter: 'Myringitis' },
                    { chapterId: 'sb_otology_28', chapterNumber: 28, chapter: 'Mucosal (suppurative) chronic otitis media' },
                    { chapterId: 'sb_otology_29', chapterNumber: 29, chapter: 'Squamous chronic otitis media' },
                    { chapterId: 'sb_otology_30', chapterNumber: 30, chapter: 'Ossicular chain pathology and reconstruction' },
                    { chapterId: 'sb_otology_31', chapterNumber: 31, chapter: 'Otosclerosis' },
                    { chapterId: 'sb_otology_32', chapterNumber: 32, chapter: 'Eustachian tube dysfunction' },
                    { chapterId: 'sb_otology_33', chapterNumber: 33, chapter: 'Systemic inflammatory conditions of the middle ear' },
                    { chapterId: 'sb_otology_34', chapterNumber: 34, chapter: 'Ototoxicity' },
                    { chapterId: 'sb_otology_35', chapterNumber: 35, chapter: 'Idiopathic sudden sensorineural hearing loss' },
                    { chapterId: 'sb_otology_36', chapterNumber: 36, chapter: 'Ear trauma and osteoradionecrosis of the temporal bone' },
                    { chapterId: 'sb_otology_37', chapterNumber: 37, chapter: 'Bone-conduction hearing devices' },
                    { chapterId: 'sb_otology_38', chapterNumber: 38, chapter: 'Cochlear implants' },
                    { chapterId: 'sb_otology_39', chapterNumber: 39, chapter: 'Middle-ear implants' },
                    { chapterId: 'sb_otology_40', chapterNumber: 40, chapter: 'Auditory brainstem implantation' }
                ]
            },
            {
                subjectId: 'lateral_skull_base', subject: 'Lateral Skull Base', pending: false, parts: null,
                chapters: [
                    { chapterId: 'sb_lateral_skull_base_01', chapterNumber: 41, chapter: 'Anatomy of the lateral skull base and infratemporal fossa' },
                    { chapterId: 'sb_lateral_skull_base_02', chapterNumber: 42, chapter: 'Clinical assessment and evaluation of a lateral skull base patient' },
                    { chapterId: 'sb_lateral_skull_base_03', chapterNumber: 43, chapter: 'Radiological evaluation of the lateral skull base' },
                    { chapterId: 'sb_lateral_skull_base_04', chapterNumber: 44, chapter: 'Surgical approaches to the lateral skull base and infratemporal fossa' },
                    { chapterId: 'sb_lateral_skull_base_05', chapterNumber: 45, chapter: 'Vestibular schwannoma presentation and natural history' },
                    { chapterId: 'sb_lateral_skull_base_06', chapterNumber: 46, chapter: 'Vestibular schwannoma management: Watch, wait and re-scan, radiotherapy and surgery' },
                    { chapterId: 'sb_lateral_skull_base_07', chapterNumber: 47, chapter: 'NF2-related schwannomatosis' },
                    { chapterId: 'sb_lateral_skull_base_08', chapterNumber: 48, chapter: 'Non-vestibular schwannoma tumours of the cerebellopontine angle' },
                    { chapterId: 'sb_lateral_skull_base_09', chapterNumber: 49, chapter: 'Middle fossa surgery' },
                    { chapterId: 'sb_lateral_skull_base_10', chapterNumber: 50, chapter: 'Jugular foramen lesions and their management' },
                    { chapterId: 'sb_lateral_skull_base_11', chapterNumber: 51, chapter: 'Petrous apex lesions' },
                    { chapterId: 'sb_lateral_skull_base_12', chapterNumber: 52, chapter: 'Temporal bone neoplasms: Benign and malignant' },
                    { chapterId: 'sb_lateral_skull_base_13', chapterNumber: 53, chapter: 'Necrotising otitis externa and skull base osteomyelitis' },
                    { chapterId: 'sb_lateral_skull_base_14', chapterNumber: 54, chapter: 'Non-neoplastic facial nerve disorders and temporal bone trauma' },
                    { chapterId: 'sb_lateral_skull_base_15', chapterNumber: 55, chapter: 'Lateral temporal bone CSF leak' },
                    { chapterId: 'sb_lateral_skull_base_16', chapterNumber: 56, chapter: 'Reconstruction of lateral skull base defects' },
                    { chapterId: 'sb_lateral_skull_base_17', chapterNumber: 57, chapter: 'Complications of lateral skull base surgery' }
                ]
            },
            {
                subjectId: 'rhinology', subject: 'Rhinology', pending: false, parts: null,
                chapters: [
                    { chapterId: 'sb_rhinology_01', chapterNumber: 58, chapter: 'Anatomy of the nose and paranasal sinuses' },
                    { chapterId: 'sb_rhinology_02', chapterNumber: 59, chapter: 'Physiology of the nose and paranasal sinuses' },
                    { chapterId: 'sb_rhinology_03', chapterNumber: 60, chapter: 'Radiological investigations used in rhinology' },
                    { chapterId: 'sb_rhinology_04', chapterNumber: 61, chapter: 'Outpatient assessment: Nose and sinuses' },
                    { chapterId: 'sb_rhinology_05', chapterNumber: 62, chapter: 'Nasal airway objective measurements' },
                    { chapterId: 'sb_rhinology_06', chapterNumber: 63, chapter: 'Relationship between the upper and lower respiratory tract: Single airway' },
                    { chapterId: 'sb_rhinology_07', chapterNumber: 64, chapter: 'Olfaction and abnormalities of smell' },
                    { chapterId: 'sb_rhinology_08', chapterNumber: 65, chapter: 'Rhinitis' },
                    { chapterId: 'sb_rhinology_09', chapterNumber: 66, chapter: 'Acute rhinosinusitis' },
                    { chapterId: 'sb_rhinology_10', chapterNumber: 67, chapter: 'Rhinosinusitis: Definitions, classification and diagnosis' },
                    { chapterId: 'sb_rhinology_11', chapterNumber: 68, chapter: 'Fungal rhinosinusitis' },
                    { chapterId: 'sb_rhinology_12', chapterNumber: 69, chapter: 'Management of chronic rhinosinusitis' },
                    { chapterId: 'sb_rhinology_13', chapterNumber: 70, chapter: 'The frontal sinus' },
                    { chapterId: 'sb_rhinology_14', chapterNumber: 71, chapter: 'Complications of rhinosinusitis' },
                    { chapterId: 'sb_rhinology_15', chapterNumber: 72, chapter: 'Mucocoeles of the paranasal sinuses' },
                    { chapterId: 'sb_rhinology_16', chapterNumber: 73, chapter: 'Diagnosis and management of facial pain' },
                    { chapterId: 'sb_rhinology_17', chapterNumber: 74, chapter: 'Management of enlarged turbinates' },
                    { chapterId: 'sb_rhinology_18', chapterNumber: 75, chapter: 'Nasal septum and nasal valve' },
                    { chapterId: 'sb_rhinology_19', chapterNumber: 76, chapter: 'Nasal septal perforation' },
                    { chapterId: 'sb_rhinology_20', chapterNumber: 77, chapter: 'Treatment of nasal and facial fractures' },
                    { chapterId: 'sb_rhinology_21', chapterNumber: 78, chapter: 'Epistaxis' },
                    { chapterId: 'sb_rhinology_22', chapterNumber: 79, chapter: 'Granulomatous conditions of the nose' },
                    { chapterId: 'sb_rhinology_23', chapterNumber: 80, chapter: 'Benign sinonasal tumours' },
                    { chapterId: 'sb_rhinology_24', chapterNumber: 81, chapter: 'Lacrimal dysfunction' },
                    { chapterId: 'sb_rhinology_25', chapterNumber: 82, chapter: 'History of modern rhinology' }
                ]
            },
            {
                subjectId: 'anterior_skull_base', subject: 'Anterior Skull Base', pending: false, parts: null,
                chapters: [
                    { chapterId: 'sb_anterior_skull_base_01', chapterNumber: 83, chapter: 'Anterior cranial fossa anatomy' },
                    { chapterId: 'sb_anterior_skull_base_02', chapterNumber: 84, chapter: 'Imaging of the anterior skull base' },
                    { chapterId: 'sb_anterior_skull_base_03', chapterNumber: 85, chapter: 'Endoscopic anterior skull base approaches' },
                    { chapterId: 'sb_anterior_skull_base_04', chapterNumber: 86, chapter: 'External approaches to the anterior cranial fossa' },
                    { chapterId: 'sb_anterior_skull_base_05', chapterNumber: 87, chapter: 'Evaluation of the anterior skull base patient' },
                    { chapterId: 'sb_anterior_skull_base_06', chapterNumber: 88, chapter: 'Complications of anterior skull base surgery' },
                    { chapterId: 'sb_anterior_skull_base_07', chapterNumber: 89, chapter: 'CSF Rhinorrhoea' },
                    { chapterId: 'sb_anterior_skull_base_08', chapterNumber: 90, chapter: 'Endoscopic management of malignant skull base neoplasms' },
                    { chapterId: 'sb_anterior_skull_base_09', chapterNumber: 91, chapter: 'Juvenile nasopharyngeal angiofibroma' },
                    { chapterId: 'sb_anterior_skull_base_10', chapterNumber: 92, chapter: 'Pterygopalatine and infratemporal fossa' },
                    { chapterId: 'sb_anterior_skull_base_11', chapterNumber: 93, chapter: 'Pituitary and parasellar lesions' },
                    { chapterId: 'sb_anterior_skull_base_12', chapterNumber: 94, chapter: 'Endoscopic approach and management of the clivus and posterior fossa' },
                    { chapterId: 'sb_anterior_skull_base_13', chapterNumber: 95, chapter: 'Craniovertebral junction' },
                    { chapterId: 'sb_anterior_skull_base_14', chapterNumber: 96, chapter: 'Orbit-endoscopic endonasal surgery' },
                    { chapterId: 'sb_anterior_skull_base_15', chapterNumber: 97, chapter: 'Transorbital approaches' },
                    { chapterId: 'sb_anterior_skull_base_16', chapterNumber: 98, chapter: 'Nasopharyngeal endoscopic resection' },
                    { chapterId: 'sb_anterior_skull_base_17', chapterNumber: 99, chapter: 'Endoscopic management of petrous apex pathology' },
                    { chapterId: 'sb_anterior_skull_base_18', chapterNumber: 100, chapter: 'Anterior skull base reconstruction' },
                    { chapterId: 'sb_anterior_skull_base_19', chapterNumber: 101, chapter: 'Anterior cranial base surgery: Past, present and future' }
                ]
            },
            {
                subjectId: 'facial_plastic_surgery', subject: 'Facial Plastic Surgery', pending: false, parts: null,
                chapters: [
                    { chapterId: 'sb_facial_plastic_surgery_01', chapterNumber: 102, chapter: 'Assessment for functional and aesthetic septorhinoplasty' },
                    { chapterId: 'sb_facial_plastic_surgery_02', chapterNumber: 103, chapter: 'Endonasal surgery in the twenty-first century' },
                    { chapterId: 'sb_facial_plastic_surgery_03', chapterNumber: 104, chapter: 'Revision rhinoplasty' },
                    { chapterId: 'sb_facial_plastic_surgery_04', chapterNumber: 105, chapter: 'Aesthetic dorsal reduction rhinoplasty' },
                    { chapterId: 'sb_facial_plastic_surgery_05', chapterNumber: 106, chapter: 'External rhinoplasty' },
                    { chapterId: 'sb_facial_plastic_surgery_06', chapterNumber: 107, chapter: 'Nasal reconstruction' },
                    { chapterId: 'sb_facial_plastic_surgery_07', chapterNumber: 108, chapter: 'An approach to pinnaplasty' },
                    { chapterId: 'sb_facial_plastic_surgery_08', chapterNumber: 109, chapter: 'Auricular reconstruction' },
                    { chapterId: 'sb_facial_plastic_surgery_09', chapterNumber: 110, chapter: 'Blepharoplasty' },
                    { chapterId: 'sb_facial_plastic_surgery_10', chapterNumber: 111, chapter: 'Surgical rejuvenation of the face' },
                    { chapterId: 'sb_facial_plastic_surgery_11', chapterNumber: 112, chapter: 'Non-surgical rejuvenation of the ageing face' },
                    { chapterId: 'sb_facial_plastic_surgery_12', chapterNumber: 113, chapter: 'Surgical management of facial paralysis' },
                    { chapterId: 'sb_facial_plastic_surgery_13', chapterNumber: 114, chapter: 'Grafts and local flaps in head and neck cancer' },
                    { chapterId: 'sb_facial_plastic_surgery_14', chapterNumber: 115, chapter: 'Rhinoplasty in the ageing patient' },
                    { chapterId: 'sb_facial_plastic_surgery_15', chapterNumber: 116, chapter: 'Preservation rhinoplasty' },
                    { chapterId: 'sb_facial_plastic_surgery_16', chapterNumber: 117, chapter: 'Nasal reconstruction in vasculitis' },
                    { chapterId: 'sb_facial_plastic_surgery_17', chapterNumber: 118, chapter: 'Rhinoplasty in the ethnic patient' },
                    { chapterId: 'sb_facial_plastic_surgery_18', chapterNumber: 119, chapter: 'Paediatric septal surgery' },
                    { chapterId: 'sb_facial_plastic_surgery_19', chapterNumber: 120, chapter: 'Nasal tip rhinoplasty' },
                    { chapterId: 'sb_facial_plastic_surgery_20', chapterNumber: 121, chapter: 'Nasal valve surgery' }
                ]
            },
            {
                subjectId: 'paediatrics', subject: 'Paediatrics', pending: false, parts: null,
                chapters: [
                    { chapterId: 'sb_paediatrics_01', chapterNumber: 122, chapter: 'Introduction/key approaches to the paediatric patient' },
                    { chapterId: 'sb_paediatrics_02', chapterNumber: 123, chapter: 'The syndromic child' },
                    { chapterId: 'sb_paediatrics_03', chapterNumber: 124, chapter: 'Management of the immunodeficient child' },
                    { chapterId: 'sb_paediatrics_04', chapterNumber: 125, chapter: 'Hearing screening and hearing tests in children' },
                    { chapterId: 'sb_paediatrics_05', chapterNumber: 126, chapter: 'Non-surgical management of the hearing-impaired child' },
                    { chapterId: 'sb_paediatrics_06', chapterNumber: 127, chapter: 'Congenital middle ear abnormalities and microtia' },
                    { chapterId: 'sb_paediatrics_07', chapterNumber: 128, chapter: 'Paediatric implantation otology' },
                    { chapterId: 'sb_paediatrics_08', chapterNumber: 129, chapter: 'Otitis media with effusion' },
                    { chapterId: 'sb_paediatrics_09', chapterNumber: 130, chapter: 'Acute otitis media' },
                    { chapterId: 'sb_paediatrics_10', chapterNumber: 131, chapter: 'Balance disorders in children' },
                    { chapterId: 'sb_paediatrics_11', chapterNumber: 132, chapter: 'Paediatric voice and disorders of communication' },
                    { chapterId: 'sb_paediatrics_12', chapterNumber: 133, chapter: 'Cleft lip and palate' },
                    { chapterId: 'sb_paediatrics_13', chapterNumber: 134, chapter: 'Craniofacial surgery' },
                    { chapterId: 'sb_paediatrics_14', chapterNumber: 135, chapter: 'Epistaxis and anterior skull base' },
                    { chapterId: 'sb_paediatrics_15', chapterNumber: 136, chapter: 'Neonatal nasal obstruction and paediatric disorders of the lacrimal drainage system' },
                    { chapterId: 'sb_paediatrics_16', chapterNumber: 137, chapter: 'Paediatric rhinosinusitis and its complications' },
                    { chapterId: 'sb_paediatrics_17', chapterNumber: 138, chapter: 'Foreign bodies in the ear, nose and throat' },
                    { chapterId: 'sb_paediatrics_18', chapterNumber: 139, chapter: 'Diseases of tonsils, tonsillectomy and tonsillotomy' },
                    { chapterId: 'sb_paediatrics_19', chapterNumber: 140, chapter: 'Paediatric obstructive sleep apnoea' },
                    { chapterId: 'sb_paediatrics_20', chapterNumber: 141, chapter: 'Acute airway management' },
                    { chapterId: 'sb_paediatrics_21', chapterNumber: 142, chapter: 'Acute head and neck infections in the child' },
                    { chapterId: 'sb_paediatrics_22', chapterNumber: 143, chapter: 'Congenital disorders of the larynx, trachea and bronchi' },
                    { chapterId: 'sb_paediatrics_23', chapterNumber: 144, chapter: 'Airway stenosis' },
                    { chapterId: 'sb_paediatrics_24', chapterNumber: 145, chapter: 'Paediatric tracheostomy' },
                    { chapterId: 'sb_paediatrics_25', chapterNumber: 146, chapter: 'Perinatal airway management' },
                    { chapterId: 'sb_paediatrics_26', chapterNumber: 147, chapter: 'Drooling and salivary pathology' },
                    { chapterId: 'sb_paediatrics_27', chapterNumber: 148, chapter: 'Tumours of the head and neck in childhood' },
                    { chapterId: 'sb_paediatrics_28', chapterNumber: 149, chapter: 'Cysts and sinuses of the head and neck' },
                    { chapterId: 'sb_paediatrics_29', chapterNumber: 150, chapter: 'Haemangiomas and vascular malformations' },
                    { chapterId: 'sb_paediatrics_30', chapterNumber: 151, chapter: 'Gastro-oesophageal disorders in children' },
                    { chapterId: 'sb_paediatrics_31', chapterNumber: 152, chapter: 'Dysphagia and aspiration' }
                ]
            },
            {
                subjectId: 'laryngology', subject: 'Laryngology', pending: false, parts: null,
                chapters: [
                    { chapterId: 'sb_laryngology_01', chapterNumber: 153, chapter: 'Anatomy of the larynx and tracheobronchial tree' },
                    { chapterId: 'sb_laryngology_02', chapterNumber: 154, chapter: 'Physiology of the larynx and voice production' },
                    { chapterId: 'sb_laryngology_03', chapterNumber: 155, chapter: 'Clinical assessment of the voice and examination of the larynx' },
                    { chapterId: 'sb_laryngology_04', chapterNumber: 156, chapter: 'Structural disorders of the vocal cords' },
                    { chapterId: 'sb_laryngology_05', chapterNumber: 157, chapter: 'Vocal cord scars and sulci' },
                    { chapterId: 'sb_laryngology_06', chapterNumber: 158, chapter: 'Functional disorders of the voice' },
                    { chapterId: 'sb_laryngology_07', chapterNumber: 159, chapter: 'Movement disorders of the larynx' },
                    { chapterId: 'sb_laryngology_08', chapterNumber: 160, chapter: 'Recurrent respiratory papillomatosis' },
                    { chapterId: 'sb_laryngology_09', chapterNumber: 161, chapter: 'Paralysis of the larynx' },
                    { chapterId: 'sb_laryngology_10', chapterNumber: 162, chapter: 'Phonomicrosurgery' },
                    { chapterId: 'sb_laryngology_11', chapterNumber: 163, chapter: 'The professional voice user' },
                    { chapterId: 'sb_laryngology_12', chapterNumber: 164, chapter: 'Office-based laryngeal procedures' },
                    { chapterId: 'sb_laryngology_13', chapterNumber: 165, chapter: 'Speech and language therapy for voice disorders' },
                    { chapterId: 'sb_laryngology_14', chapterNumber: 166, chapter: 'Acute infections of the larynx' },
                    { chapterId: 'sb_laryngology_15', chapterNumber: 167, chapter: 'Chronic laryngitis' },
                    { chapterId: 'sb_laryngology_16', chapterNumber: 168, chapter: 'Pharyngitis' },
                    { chapterId: 'sb_laryngology_17', chapterNumber: 169, chapter: 'Anatomy of the pharynx and oesophagus' },
                    { chapterId: 'sb_laryngology_18', chapterNumber: 170, chapter: 'Physiology of swallowing' },
                    { chapterId: 'sb_laryngology_19', chapterNumber: 171, chapter: 'Swallowing assessment' },
                    { chapterId: 'sb_laryngology_20', chapterNumber: 172, chapter: 'Neurological dysphagia' },
                    { chapterId: 'sb_laryngology_21', chapterNumber: 173, chapter: 'Cricopharyngeal muscle dysfunction' },
                    { chapterId: 'sb_laryngology_22', chapterNumber: 174, chapter: 'Benign oesophageal diseases' },
                    { chapterId: 'sb_laryngology_23', chapterNumber: 175, chapter: 'Chronic aspiration' },
                    { chapterId: 'sb_laryngology_24', chapterNumber: 176, chapter: 'Swallowing rehabilitation' },
                    { chapterId: 'sb_laryngology_25', chapterNumber: 177, chapter: 'Globus' },
                    { chapterId: 'sb_laryngology_26', chapterNumber: 178, chapter: 'Laryngotracheal trauma' },
                    { chapterId: 'sb_laryngology_27', chapterNumber: 179, chapter: 'Tracheostomy' },
                    { chapterId: 'sb_laryngology_28', chapterNumber: 180, chapter: 'Adult laryngotracheal stenosis' },
                    { chapterId: 'sb_laryngology_29', chapterNumber: 181, chapter: 'Inducible laryngeal obstruction: An upper airway contributor of breathing difficulties' },
                    { chapterId: 'sb_laryngology_30', chapterNumber: 182, chapter: 'Chronic cough' }
                ]
            },
            {
                subjectId: 'head_neck', subject: 'Head and Neck', pending: false, chapters: null,
                parts: [
                    {
                        partId: 'head_neck_cancer', partNumber: 1, part: 'Head and neck cancer',
                        chapters: [
                            { chapterId: 'sb_head_neck_01', chapterNumber: 183, chapter: 'Aetiology and epidemiology' },
                            { chapterId: 'sb_head_neck_02', chapterNumber: 184, chapter: 'Tumour biology' },
                            { chapterId: 'sb_head_neck_03', chapterNumber: 185, chapter: 'Staging' },
                            { chapterId: 'sb_head_neck_04', chapterNumber: 186, chapter: 'Multidisciplinary teamwork' },
                            { chapterId: 'sb_head_neck_05', chapterNumber: 187, chapter: 'Nutrition' },
                            { chapterId: 'sb_head_neck_06', chapterNumber: 188, chapter: 'Speech, voice and swallow rehabilitation' },
                            { chapterId: 'sb_head_neck_07', chapterNumber: 189, chapter: 'Clinical outcome and survivorship' },
                            { chapterId: 'sb_head_neck_08', chapterNumber: 190, chapter: 'Palliative care' }
                        ]
                    },
                    {
                        partId: 'upper_aerodigestive_tract', partNumber: 2, part: 'Upper aerodigestive tract',
                        chapters: [
                            { chapterId: 'sb_head_neck_09', chapterNumber: 191, chapter: 'Oral cavity tumours' },
                            { chapterId: 'sb_head_neck_10', chapterNumber: 192, chapter: 'Oropharyngeal tumours' },
                            { chapterId: 'sb_head_neck_11', chapterNumber: 193, chapter: 'Malignant tumours of the larynx' },
                            { chapterId: 'sb_head_neck_12', chapterNumber: 194, chapter: 'Rehabilitation after total laryngectomy' },
                            { chapterId: 'sb_head_neck_13', chapterNumber: 195, chapter: 'Open conservation surgery for laryngeal cancer' },
                            { chapterId: 'sb_head_neck_14', chapterNumber: 196, chapter: 'Management of hypopharyngeal cancer' },
                            { chapterId: 'sb_head_neck_15', chapterNumber: 197, chapter: 'Unknown primary within the head and neck' },
                            { chapterId: 'sb_head_neck_16', chapterNumber: 198, chapter: 'Surgical anatomy for transoral surgery' },
                            { chapterId: 'sb_head_neck_17', chapterNumber: 199, chapter: 'Transoral surgery' },
                            { chapterId: 'sb_head_neck_18', chapterNumber: 200, chapter: 'Metastatic neck disease' }
                        ]
                    },
                    {
                        partId: 'salivary_glands', partNumber: 3, part: 'Salivary glands',
                        chapters: [
                            { chapterId: 'sb_head_neck_19', chapterNumber: 201, chapter: 'Anatomy and physiology of the salivary glands' },
                            { chapterId: 'sb_head_neck_20', chapterNumber: 202, chapter: 'Benign salivary gland tumours' },
                            { chapterId: 'sb_head_neck_21', chapterNumber: 203, chapter: 'Malignant tumours of the salivary glands' },
                            { chapterId: 'sb_head_neck_22', chapterNumber: 204, chapter: 'Non-neoplastic salivary gland conditions' }
                        ]
                    },
                    {
                        partId: 'skin', partNumber: 4, part: 'Skin',
                        chapters: [
                            { chapterId: 'sb_head_neck_23', chapterNumber: 205, chapter: 'Benign skin lesions' },
                            { chapterId: 'sb_head_neck_24', chapterNumber: 206, chapter: 'Non-melanoma skin cancer' },
                            { chapterId: 'sb_head_neck_25', chapterNumber: 207, chapter: 'Cutaneous melanoma' }
                        ]
                    },
                    {
                        partId: 'skull_base_hn', partNumber: 5, part: 'Skull base',
                        chapters: [
                            { chapterId: 'sb_head_neck_26', chapterNumber: 208, chapter: 'Sinonasal, orbital and anterior skull base malignancies' },
                            { chapterId: 'sb_head_neck_27', chapterNumber: 209, chapter: 'Nasopharyngeal carcinoma' },
                            { chapterId: 'sb_head_neck_28', chapterNumber: 210, chapter: 'Paragangliomas of the neck' },
                            { chapterId: 'sb_head_neck_29', chapterNumber: 211, chapter: 'Parapharyngeal space tumours' }
                        ]
                    },
                    {
                        partId: 'reconstruction', partNumber: 6, part: 'Reconstruction',
                        chapters: [
                            { chapterId: 'sb_head_neck_30', chapterNumber: 212, chapter: 'Grafts, local and regional flaps' },
                            { chapterId: 'sb_head_neck_31', chapterNumber: 213, chapter: 'Free-tissue transfer in head and neck surgery' }
                        ]
                    },
                    {
                        partId: 'radiation_medical_oncology', partNumber: 7, part: 'Radiation and medical oncology',
                        chapters: [
                            { chapterId: 'sb_head_neck_32', chapterNumber: 214, chapter: 'Radiotherapy' },
                            { chapterId: 'sb_head_neck_33', chapterNumber: 215, chapter: 'Principles of chemotherapy' },
                            { chapterId: 'sb_head_neck_34', chapterNumber: 216, chapter: 'Biologically targeted agents' }
                        ]
                    },
                    {
                        partId: 'miscellaneous_hn', partNumber: 8, part: 'Miscellaneous',
                        chapters: [
                            { chapterId: 'sb_head_neck_35', chapterNumber: 217, chapter: 'Anatomy of the mouth and teeth' },
                            { chapterId: 'sb_head_neck_36', chapterNumber: 218, chapter: 'Anatomy of the neck' },
                            { chapterId: 'sb_head_neck_37', chapterNumber: 219, chapter: 'Pathology' },
                            { chapterId: 'sb_head_neck_38', chapterNumber: 220, chapter: 'Benign neck disease' },
                            { chapterId: 'sb_head_neck_39', chapterNumber: 221, chapter: 'Neck trauma' },
                            { chapterId: 'sb_head_neck_40', chapterNumber: 222, chapter: 'Neck space infections' },
                            { chapterId: 'sb_head_neck_41', chapterNumber: 223, chapter: 'Maxillofacial prosthodontics and rehabilitation of oncological orofacial defects' },
                            { chapterId: 'sb_head_neck_42', chapterNumber: 224, chapter: 'Prosthetics: Facial prosthetic – Rehabilitation' },
                            { chapterId: 'sb_head_neck_43', chapterNumber: 225, chapter: 'Obstructive sleep apnoea and snoring' },
                            { chapterId: 'sb_head_neck_44', chapterNumber: 226, chapter: 'Benign oral and dental disease' }
                        ]
                    }
                ]
            },
            {
                subjectId: 'head_neck_endocrine', subject: 'Head and Neck Endocrine', pending: false, parts: null,
                chapters: [
                    { chapterId: 'sb_head_neck_endocrine_01', chapterNumber: 227, chapter: 'Embryology, anatomy and physiology of the thyroid and parathyroid glands' },
                    { chapterId: 'sb_head_neck_endocrine_02', chapterNumber: 228, chapter: 'Thyroid and parathyroid gland pathology' },
                    { chapterId: 'sb_head_neck_endocrine_03', chapterNumber: 229, chapter: 'The genetics of malignant thyroid disease and thyroid nodules' },
                    { chapterId: 'sb_head_neck_endocrine_04', chapterNumber: 230, chapter: 'Assessment, investigation and imaging of the thyroid: Assessment of structure and function' },
                    { chapterId: 'sb_head_neck_endocrine_05', chapterNumber: 231, chapter: 'Medical management of thyroid dysregulation: Hyperthyroidism and hypothyroidism' },
                    { chapterId: 'sb_head_neck_endocrine_06', chapterNumber: 232, chapter: 'Surgical approaches to the thyroid' },
                    { chapterId: 'sb_head_neck_endocrine_07', chapterNumber: 233, chapter: 'Surgical management of the compressive thyroid goitre: Intrathoracic and ectopic thyroid glands' },
                    { chapterId: 'sb_head_neck_endocrine_08', chapterNumber: 234, chapter: 'Surgical management of hyperthyroidism' },
                    { chapterId: 'sb_head_neck_endocrine_09', chapterNumber: 235, chapter: 'Radioactive iodine for thyroid disease' },
                    { chapterId: 'sb_head_neck_endocrine_10', chapterNumber: 236, chapter: 'Management of differentiated thyroid cancer: Risk stratification, staging, indications for treatment, oncological management and follow-up' },
                    { chapterId: 'sb_head_neck_endocrine_11', chapterNumber: 237, chapter: 'Rare thyroid abnormalities and cancers' },
                    { chapterId: 'sb_head_neck_endocrine_12', chapterNumber: 238, chapter: 'Management of medullary thyroid cancer' },
                    { chapterId: 'sb_head_neck_endocrine_13', chapterNumber: 239, chapter: 'Management of poorly differentiated, high-grade and anaplastic thyroid cancer' },
                    { chapterId: 'sb_head_neck_endocrine_14', chapterNumber: 240, chapter: 'Management of locoregionally advanced and recurrent thyroid cancer' },
                    { chapterId: 'sb_head_neck_endocrine_15', chapterNumber: 241, chapter: 'Management of advanced thyroid cancer, metastatic thyroid cancers and radioiodine refractory cancers: Oncological and redifferentiation treatment' },
                    { chapterId: 'sb_head_neck_endocrine_16', chapterNumber: 242, chapter: 'Management of paediatric thyroid cancers (differentiated and medullary)' },
                    { chapterId: 'sb_head_neck_endocrine_17', chapterNumber: 243, chapter: 'Nerve monitoring in thyroid and parathyroid surgery' },
                    { chapterId: 'sb_head_neck_endocrine_18', chapterNumber: 244, chapter: 'Ablative technologies in the thyroid and parathyroids' },
                    { chapterId: 'sb_head_neck_endocrine_19', chapterNumber: 245, chapter: 'Parathyroid preservation in thyroid surgery' },
                    { chapterId: 'sb_head_neck_endocrine_20', chapterNumber: 246, chapter: 'Physiology, assessment and investigation of parathyroid dysregulation' },
                    { chapterId: 'sb_head_neck_endocrine_21', chapterNumber: 247, chapter: 'Imaging for parathyroid surgery' },
                    { chapterId: 'sb_head_neck_endocrine_22', chapterNumber: 248, chapter: 'Parathyroid dysfunction: Medical and surgical therapy' },
                    { chapterId: 'sb_head_neck_endocrine_23', chapterNumber: 249, chapter: 'Redo parathyroid surgery: Management of surgical failure' },
                    { chapterId: 'sb_head_neck_endocrine_24', chapterNumber: 250, chapter: 'Management of atypical adenomas and parathyroid cancer' },
                    { chapterId: 'sb_head_neck_endocrine_25', chapterNumber: 251, chapter: 'Complications of thyroid and parathyroid surgery' },
                    { chapterId: 'sb_head_neck_endocrine_26', chapterNumber: 252, chapter: 'Medicolegal aspects of thyroid and parathyroid surgery' }
                ]
            }
        ];

        // Future scalability envelope (section 11): additional textbooks can
        // be added as siblings here without changing SCOTT_BROWN_TAXONOMY's
        // own shape. Not wired into the UI yet - there's only one book so
        // far - but the data model won't need to change when a second one
        // is added.
        const CLASSIFICATION_BOOKS = [
            { bookId: 'scott_brown', book: 'Scott-Brown\'s Otorhinolaryngology, Head and Neck Surgery', subjects: SCOTT_BROWN_TAXONOMY }
        ];

        // ============================================================
        //  LEGACY -> SCOTT-BROWN MIGRATION MAP
        //  Every entry here was matched by hand against the two chapter
        //  lists (exact or near-exact title correspondence, or a single
        //  unambiguous topical match with no other candidate). Anything
        //  NOT listed here is intentionally left unmapped - per the
        //  brief, an unreliable mapping must fall through to "needs
        //  review" rather than be guessed. See the migration report for
        //  the full reasoning behind each inclusion/exclusion.
        //
        //  subjectId: null means "do not even guess the subject" (the old
        //  subject has no safe 1:1 new-subject correspondence - e.g. old
        //  "Skull Base" could mean either new Lateral or Anterior Skull
        //  Base, and old "Swallowing & Dysphagia" has no matching subject
        //  in the 9 supplied at all).
        // ============================================================
        const LEGACY_CLASSIFICATION_MAP = {
            'Otology': {
                subjectId: 'otology',
                chapters: {
                    'Anatomy and embryology of the external and middle ear': 'sb_otology_18',
                    'Anatomy of the cochlea and vestibular system: relating ultrastructure to function': 'sb_otology_19',
                    'Physiology of hearing': 'sb_otology_01',
                    'Physiology of equilibrium': 'sb_otology_02',
                    'Evaluation of balance': 'sb_otology_02',
                    'Psychoacoustic audiometry': 'sb_otology_03',
                    'Evoked measurement of auditory sensitivity': 'sb_otology_03',
                    'Prevention of hearing loss': 'sb_otology_04',
                    'Age\u2011related sensorineural hearing impairment': 'sb_otology_05',
                    'Noise\u2011induced hearing loss and related conditions': 'sb_otology_06',
                    'Ototoxicity': 'sb_otology_34',
                    'Idiopathic sudden sensorineural hearing loss': 'sb_otology_35',
                    'Tinnitus and hyperacusis': 'sb_otology_09',
                    'Understanding tinnitus: a psychological perspective': 'sb_otology_09',
                    'Meniere\'s disease': 'sb_otology_10',
                    'Benign paroxysmal positional vertigo': 'sb_otology_11',
                    'Superior semicircular canal dehiscence': 'sb_otology_12',
                    'Vestibular neuritis': 'sb_otology_13',
                    'Vestibular migraine': 'sb_otology_14',
                    'Vestibular rehabilitation': 'sb_otology_15',
                    'Auditory neuropathy spectrum disorder and retrocochlear disorders in adults and children': 'sb_otology_08',
                    'Auditory processing disorders across the age span': 'sb_otology_16',
                    'Neuropsychiatric aspects of vestibular disorders': 'sb_otology_17',
                    'Clinical examination of the ears and hearing': 'sb_otology_20',
                    'Furunculosis': 'sb_otology_25',
                    'Myringitis': 'sb_otology_27',
                    'Keratosis obturans, primary auditory canal cholesteatoma and benign necrotizing otitis externa': 'sb_otology_26',
                    'Acquired atresia of the external ear': 'sb_otology_24',
                    'Otitis externa and otomycosis': 'sb_otology_25',
                    'Perichondritis of the external ear': 'sb_otology_23',
                    'Exostosis of the external auditory canal': 'sb_otology_24',
                    'Osteoradionecrosis of the temporal bone': 'sb_otology_36',
                    'Ossiculoplasty': 'sb_otology_30',
                    'Eustachian tube dysfunction': 'sb_otology_32',
                    'Otoendoscopy': 'sb_otology_21',
                    'Tuberculosis of the temporal bone': 'sb_otology_33',
                    'Otosclerosis': 'sb_otology_31',
                    'Ear trauma': 'sb_otology_36',
                    'Otalgia': 'sb_otology_22',
                    'Bone\u2011conduction hearing devices': 'sb_otology_37',
                    'Cochlear implants': 'sb_otology_38',
                    'Middle ear implants': 'sb_otology_39',
                    'Auditory brainstem implantation': 'sb_otology_40'
                    // Not mapped (no confident new-chapter match) - falls
                    // through to subject-only match, needs_review:
                    // 'Perception of sounds at the auditory cortex',
                    // 'Hearing aids',
                    // 'Beyond hearing aids: an overview of adult audiological rehabilitation',
                    // 'Autosomal dominant non-syndromic sensorineural hearing loss',
                    // 'Acute otitis media and otitis media with effusion in adults',
                    // 'Myringoplasty', 'Otological effects of Paget's disease',
                    // 'Imaging of the temporal bone'
                }
            },
            'Rhinology': {
                subjectId: 'rhinology',
                chapters: {
                    'Anatomy of the nose and paranasal sinuses': 'sb_rhinology_01',
                    'Outpatient assessment': 'sb_rhinology_04',
                    'Physiology of the nose and paranasal sinuses': 'sb_rhinology_02',
                    'Measurement of the nasal airway': 'sb_rhinology_05',
                    'Allergic rhinitis': 'sb_rhinology_08',
                    'Non\u2011allergic perennial rhinitis': 'sb_rhinology_08',
                    'Occupational rhinitis': 'sb_rhinology_08',
                    'Rhinosinusitis: Definitions, classification and diagnosis': 'sb_rhinology_10',
                    'Nasal polyposis': 'sb_rhinology_12',
                    'Fungal rhinosinusitis': 'sb_rhinology_11',
                    'The frontal sinus': 'sb_rhinology_13',
                    'Mucoceles of the paranasal sinuses': 'sb_rhinology_15',
                    'Complications of rhinosinusitis': 'sb_rhinology_14',
                    'The relationship between the upper and lower respiratory tract': 'sb_rhinology_06',
                    'Nasal septum and nasal valve': 'sb_rhinology_18',
                    'Nasal septal perforations': 'sb_rhinology_19',
                    'Management of enlarged turbinates': 'sb_rhinology_17',
                    'Epistaxis': 'sb_rhinology_21',
                    'Nasal and facial fractures': 'sb_rhinology_20',
                    'Granulomatous conditions of the nose': 'sb_rhinology_22',
                    'Abnormalities of smell': 'sb_rhinology_07',
                    'Diagnosis and management of facial pain': 'sb_rhinology_16',
                    'Juvenile angiofibroma': 'sb_rhinology_23',
                    'Endoscopic management of sinonasal tumours': 'sb_rhinology_23',
                    'Imaging in rhinology': 'sb_rhinology_03',
                    'Acute infection in case of maxillary sinusitis': 'sb_rhinology_09'
                    // Not mapped - ambiguous or no candidate, needs_review:
                    // 'Medical management for rhinosinusitis' / 'Surgical
                    //   management of rhinosinusitis' (could be Acute or
                    //   Management of chronic - genuinely ambiguous),
                    // 'CSF leaks' and 'Surgical management of pituitary and
                    //   paraseptal diseases' and 'Extended anterior skull
                    //   base approaches' (very likely now live under the
                    //   new Anterior Skull Base subject instead, but that
                    //   subject has no chapters populated yet),
                    // 'Disorders of the orbit'
                }
            },
            // Subject-level-only correspondence: confident about which new
            // Subject these belong to, but with no chapter list yet to
            // place them more precisely, so every question keeps its
            // subject and goes to chapter-level needs_review.
            'Paediatric ENT': { subjectId: 'paediatrics', chapters: {} },
            'Laryngology & Voice': { subjectId: 'laryngology', chapters: {} },
            'Facial Plastic & Reconstructive': { subjectId: 'facial_plastic_surgery', chapters: {} },
            'Head & Neck Surgery': { subjectId: 'head_neck', chapters: {} },
            // Genuinely ambiguous or unmatched at the SUBJECT level too -
            // do not guess. 'Skull Base' could be Lateral or Anterior;
            // 'Swallowing & Dysphagia' has no corresponding subject in the
            // 9 supplied (it may turn out to be a Part/Chapter within Head
            // and Neck or Laryngology once their chapter lists arrive).
            'Skull Base': { subjectId: null, chapters: {} },
            'Swallowing & Dysphagia': { subjectId: null, chapters: {} }
        };

        const ALL_SUBJECTS = Object.keys(ENT_DATA).sort();
        const ALL_CHAPTERS = Object.values(ENT_DATA).flat().sort((a, b) => a.localeCompare(b));

        // Dynamic taxonomy: the curated ENT_DATA list stays as the baseline, but any
        // subject/chapter that actually exists on real questions (e.g. imported from a
        // JSON whose classification uses different book/chapter names) is folded in too.
        // This is what every Subject/Chapter dropdown in the app should read from -
        // never ALL_SUBJECTS/ALL_CHAPTERS alone - so a question's real classification is
        // always selectable and visible, not just silently preserved in the database.
        function computeTaxonomy(questions) {
            const bySubject = {};
            for (const s of SCOTT_BROWN_TAXONOMY) {
                bySubject[s.subject] = new Set();
                if (s.chapters) s.chapters.forEach(c => bySubject[s.subject].add(c.chapter));
                if (s.parts) s.parts.forEach(p => p.chapters.forEach(c => bySubject[s.subject].add(c.chapter)));
            }
            (questions || []).forEach(q => {
                const subj = (q.subject || '').trim();
                if (!subj || subj === 'Uncategorized') return;
                if (!bySubject[subj]) bySubject[subj] = new Set();
                const chap = (q.chapter || '').trim();
                if (chap && chap !== 'General') bySubject[subj].add(chap);
            });
            const subjects = Object.keys(bySubject).sort((a, b) => a.localeCompare(b));
            const chaptersBySubject = {};
            subjects.forEach(s => { chaptersBySubject[s] = Array.from(bySubject[s]).sort((a, b) => a.localeCompare(b)); });
            const allChapters = Array.from(new Set(subjects.flatMap(s => chaptersBySubject[s]))).sort((a, b) => a.localeCompare(b));
            return { subjects, chaptersBySubject, allChapters };
        }

// ============================================================
//  OPTIMIZATION LAYER 1: WEB WORKER ENGINE
//  Offloads heavy computation (search indexing, filtering,
//  analytics, duplicate detection) to a background thread.
//  Automatically falls back to main-thread execution if
//  Workers are unavailable, blocked by CSP, or time out.
// ============================================================
const WORKER_CODE = `
let searchIndex = new Map();
let sortedIndexWords = [];
let questionMap = new Map();

function buildIndex(qs) {
  searchIndex.clear();
  questionMap.clear();
  for (const q of qs) {
    questionMap.set(q.id, q);
    const text = [
      q.questionText || '',
      q.explanation || '',
      q.subject || '',
      q.chapter || '',
      q.topic || '',
      Array.isArray(q.tags) ? q.tags.join(' ') : (q.tags || '')
    ].join(' ').toLowerCase();
    const words = [...new Set(text.match(/\b[a-z0-9]+\b/g) || [])];
    for (const w of words) {
      if (!searchIndex.has(w)) searchIndex.set(w, new Set());
      searchIndex.get(w).add(q.id);
    }
  }
  sortedIndexWords = Array.from(searchIndex.keys()).sort();
  return { count: qs.length, terms: searchIndex.size };
}

function lowerBound(prefix) {
  let lo = 0, hi = sortedIndexWords.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (sortedIndexWords[mid] < prefix) lo = mid + 1; else hi = mid;
  }
  return lo;
}

function wordsWithPrefix(prefix) {
  const words = [];
  for (let i = lowerBound(prefix); i < sortedIndexWords.length; i++) {
    const w = sortedIndexWords[i];
    if (!w.startsWith(prefix)) break;
    words.push(w);
  }
  return words;
}

function search(query) {
  if (!query) return null;
  const terms = query.toLowerCase().match(/\b[a-z0-9]+\b/g) || [];
  if (!terms.length) return null;
  let result = null;
  for (const term of terms) {
    const matches = wordsWithPrefix(term);
    let termIds;
    if (matches.length === 0) termIds = new Set();
    else if (matches.length === 1) termIds = searchIndex.get(matches[0]);
    else {
      termIds = new Set();
      for (const w of matches) for (const id of searchIndex.get(w)) termIds.add(id);
    }
    if (result === null) result = new Set(termIds);
    else { for (const id of result) { if (!termIds.has(id)) result.delete(id); } }
    if (!result.size) break;
  }
  return result ? [...result] : [];
}

function filterQuestions(payload) {
  const { questions, filters, searchQuery, bmIds, hyIds, missedIds } = payload;
  const qf = filters || {};
  const sq = (searchQuery || '').toLowerCase();
  let result = questions;
  if (sq) {
    const words = sq.match(/\b[a-z0-9]+\b/g) || [];
    if (words.length) {
      result = result.filter(q => {
        const text = [
          q.questionText, q.explanation, q.subject, q.chapter, q.topic,
          Array.isArray(q.tags) ? q.tags.join(' ') : q.tags
        ].join(' ').toLowerCase();
        return words.every(w => text.includes(w));
      });
    }
  }
  if (qf.subject !== 'all') result = result.filter(q => (q.subject || '') === qf.subject);
  if (qf.chapter !== 'all') result = result.filter(q => (q.chapter || '') === qf.chapter);
  if (qf.topic !== 'all') result = result.filter(q => (q.topic || '') === qf.topic);
  if (qf.difficulty !== 'all') result = result.filter(q => (q.difficulty || 'Medium') === qf.difficulty);
  const special = qf.special || 'all';
  if (special === 'bookmarked') result = result.filter(q => bmIds.includes(q.id));
  if (special === 'highyield') result = result.filter(q => hyIds.includes(q.id));
  if (special === 'missed') result = result.filter(q => missedIds.includes(q.id));
  return result;
}

function computeAnalytics(payload) {
  const { questions, performance, bookmarks, examHistory } = payload;
  const total = questions.length;
  const correct = performance.filter(x => x.correct).length;
  const wrong = performance.length - correct;
  const acc = performance.length ? Math.round(correct * 100 / performance.length) : 0;
  const avg = examHistory.length ? Math.round(examHistory.reduce((s, e) => s + (e.percentage || 0), 0) / examHistory.length) : 0;
  const subjectCounts = {};
  questions.forEach(q => { const s = q.subject || 'Uncategorized'; subjectCounts[s] = (subjectCounts[s] || 0) + 1; });
  const weakTopics = {};
  performance.forEach(x => {
    const key = (x.subject || 'Unknown') + ' > ' + (x.chapter || 'Unknown') + ' > ' + (x.topic || 'Unknown');
    if (!weakTopics[key]) weakTopics[key] = { t: 0, c: 0 };
    weakTopics[key].t++;
    if (x.correct) weakTopics[key].c++;
  });
  const weakArr = Object.entries(weakTopics)
    .filter(([k, v]) => v.t >= 2)
    .map(([k, v]) => ({ k, p: Math.round(v.c * 100 / v.t), t: v.t }))
    .sort((a, b) => a.p - b.p)
    .slice(0, 5);
  return { total, bookmarks: bookmarks.length, exams: examHistory.length, correct, wrong, acc, avg, subjectCounts, weakArr };
}

function findDuplicates(qs) {
  const map = new Map();
  const dups = [];
  for (const q of qs) {
    const key = (q.questionText || '').toLowerCase().trim();
    if (map.has(key)) dups.push(q);
    else map.set(key, q.id);
  }
  return dups;
}

self.onmessage = function(e) {
  const { type, payload, id } = e.data;
  let result;
  try {
    switch (type) {
      case 'buildIndex': result = buildIndex(payload); break;
      case 'search': result = search(payload); break;
      case 'filter': result = filterQuestions(payload); break;
      case 'analytics': result = computeAnalytics(payload); break;
      case 'duplicates': result = findDuplicates(payload); break;
      default: result = { error: 'Unknown type' };
    }
  } catch (err) {
    result = { error: err.message };
  }
  self.postMessage({ id, type, result });
};
`;

const WorkerPool = {
  worker: null,
  queue: new Map(),
  msgId: 0,
  enabled: true,

  /** Initialize the worker from an inline blob. Returns true on success. */
  init() {
    if (this.worker || typeof Worker === 'undefined') return false;
    try {
      const blob = new Blob([WORKER_CODE], { type: 'application/javascript' });
      this.worker = new Worker(URL.createObjectURL(blob));
      this.worker.onmessage = (e) => {
        const { id, result } = e.data;
        const pending = this.queue.get(id);
        if (pending) {
          this.queue.delete(id);
          pending.resolve(result);
        }
      };
      this.worker.onerror = (err) => {
        console.error('Worker fatal error:', err);
        this.enabled = false;
        this.worker = null;
        for (const [id, pending] of this.queue) {
          pending.reject(err);
        }
        this.queue.clear();
      };
      return true;
    } catch (e) {
      console.warn('Worker initialization failed:', e);
      this.enabled = false;
      return false;
    }
  },

  /** Post a task to the worker with automatic fallback. */
  async post(type, payload) {
    if (!this.worker && this.enabled) this.init();
    if (!this.worker || !this.enabled) {
      return this.fallback(type, payload);
    }
    const id = ++this.msgId;
    return new Promise((resolve, reject) => {
      this.queue.set(id, { resolve, reject });
      this.worker.postMessage({ type, payload, id });
      // Safety timeout: fallback if worker hangs
      setTimeout(() => {
        if (this.queue.has(id)) {
          this.queue.delete(id);
          reject(new Error('Worker timeout'));
        }
      }, 15000);
    }).catch(err => {
      console.warn('Worker task failed, falling back to main thread:', err);
      return this.fallback(type, payload);
    });
  },

  /** Synchronous fallback implementations when Worker is unavailable. */
  fallback(type, payload) {
    switch (type) {
      case 'filter': {
        const { questions, filters, searchQuery, bmIds, hyIds, missedIds } = payload;
        const qf = filters || {};
        const sq = (searchQuery || '').toLowerCase();
        let result = questions;
        if (sq) {
          const words = sq.match(/\b[a-z0-9]+\b/g) || [];
          if (words.length) {
            result = result.filter(q => {
              const text = [q.questionText, q.explanation, q.subject, q.chapter, q.topic, Array.isArray(q.tags) ? q.tags.join(' ') : q.tags].join(' ').toLowerCase();
              return words.every(w => text.includes(w));
            });
          }
        }
        if (qf.subject !== 'all') result = result.filter(q => (q.subject || '') === qf.subject);
        if (qf.chapter !== 'all') result = result.filter(q => (q.chapter || '') === qf.chapter);
        if (qf.topic !== 'all') result = result.filter(q => (q.topic || '') === qf.topic);
        if (qf.difficulty !== 'all') result = result.filter(q => (q.difficulty || 'Medium') === qf.difficulty);
        const special = qf.special || 'all';
        if (special === 'bookmarked') result = result.filter(q => bmIds.includes(q.id));
        if (special === 'highyield') result = result.filter(q => hyIds.includes(q.id));
        if (special === 'missed') result = result.filter(q => missedIds.includes(q.id));
        return result;
      }
      case 'analytics': {
        const { questions, performance, bookmarks, examHistory } = payload;
        const total = questions.length;
        const correct = performance.filter(x => x.correct).length;
        const wrong = performance.length - correct;
        const acc = performance.length ? Math.round(correct * 100 / performance.length) : 0;
        const avg = examHistory.length ? Math.round(examHistory.reduce((s, e) => s + (e.percentage || 0), 0) / examHistory.length) : 0;
        const subjectCounts = {};
        questions.forEach(q => { const s = q.subject || 'Uncategorized'; subjectCounts[s] = (subjectCounts[s] || 0) + 1; });
        const weakTopics = {};
        performance.forEach(x => {
          const key = (x.subject || 'Unknown') + ' > ' + (x.chapter || 'Unknown') + ' > ' + (x.topic || 'Unknown');
          if (!weakTopics[key]) weakTopics[key] = { t: 0, c: 0 };
          weakTopics[key].t++;
          if (x.correct) weakTopics[key].c++;
        });
        const weakArr = Object.entries(weakTopics)
          .filter(([k, v]) => v.t >= 2)
          .map(([k, v]) => ({ k, p: Math.round(v.c * 100 / v.t), t: v.t }))
          .sort((a, b) => a.p - b.p)
          .slice(0, 5);
        return { total, bookmarks: bookmarks.length, exams: examHistory.length, correct, wrong, acc, avg, subjectCounts, weakArr };
      }
      case 'duplicates': {
        const map = new Map(), dups = [];
        for (const q of payload) {
          const key = (q.questionText || '').toLowerCase().trim();
          if (map.has(key)) dups.push(q);
          else map.set(key, q.id);
        }
        return dups;
      }
      case 'search': {
        // Fallback search is handled by GlobalSearchIndex on main thread
        return null;
      }
      default: return null;
    }
  }
};

// ============================================================
//  OPTIMIZATION LAYER 2: IN-MEMORY SEARCH INDEX
//  Builds an inverted index mapping every word to the set of
//  question IDs containing it. Rebuilt automatically whenever
//  the underlying question cache version changes.
// ============================================================
const GlobalSearchIndex = {
  index: new Map(),      // exact word -> Set of question IDs
  sortedWords: [],       // all unique indexed words, sorted - enables binary-search prefix lookup
  ready: false,
  version: -1,

  /** Ensure the index is current with the DB cache version. */
  async ensureBuilt() {
    const cv = db._cacheVersion;
    if (this.ready && this.version === cv) return;
    const questions = await db.getAllQuestions();
    this.index.clear();
    for (const q of questions) {
      const text = [
        q.questionText || '',
        q.explanation || '',
        q.subject || '',
        q.chapter || '',
        q.topic || '',
        Array.isArray(q.tags) ? q.tags.join(' ') : (q.tags || '')
      ].join(' ').toLowerCase();
      const words = [...new Set(text.match(/\b[a-z0-9]+\b/g) || [])];
      for (const w of words) {
        if (!this.index.has(w)) this.index.set(w, new Set());
        this.index.get(w).add(q.id);
      }
    }
    this.sortedWords = Array.from(this.index.keys()).sort();
    this.ready = true;
    this.version = cv;
  },

  /** Binary search: first index where sortedWords[i] >= prefix. */
  _lowerBound(prefix) {
    let lo = 0, hi = this.sortedWords.length;
    while (lo < hi) {
      const mid = (lo + hi) >>> 1;
      if (this.sortedWords[mid] < prefix) lo = mid + 1; else hi = mid;
    }
    return lo;
  },

  /** All indexed words starting with `prefix`, found via binary search for the range (not a full scan). */
  _wordsWithPrefix(prefix) {
    const words = [];
    for (let i = this._lowerBound(prefix); i < this.sortedWords.length; i++) {
      const w = this.sortedWords[i];
      if (!w.startsWith(prefix)) break; // sorted, so matches are contiguous - safe to stop early
      words.push(w);
    }
    return words;
  },

  /** Search the index. Each space-separated term is prefix-matched; terms are ANDed together. Returns a Set of question IDs, or null if no usable query yet. */
  search(query) {
    if (!query || !this.ready) return null;
    const terms = query.toLowerCase().match(/\b[a-z0-9]+\b/g) || [];
    if (!terms.length) return null;
    let result = null;
    for (const term of terms) {
      const matches = this._wordsWithPrefix(term);
      let termIds;
      if (matches.length === 0) termIds = new Set();
      else if (matches.length === 1) termIds = this.index.get(matches[0]);
      else {
        termIds = new Set();
        for (const w of matches) for (const id of this.index.get(w)) termIds.add(id);
      }
      if (result === null) result = new Set(termIds);
      else { for (const id of result) { if (!termIds.has(id)) result.delete(id); } }
      if (!result.size) break;
    }
    return result;
  }
};

// ============================================================
//  OPTIMIZATION LAYER 3: FILTER CACHE
//  Memoizes filtered result arrays keyed by a hash of the active
//  filters + search query. Automatically invalidated whenever
//  the DB cache version increments (import, edit, delete, restore).
//  LRU eviction keeps memory bounded at 30 entries.
// ============================================================
const FilterCache = {
  _store: new Map(),
  _version: -1,

  get(filters, searchQuery, cacheVersion, factory) {
    if (this._version !== cacheVersion) {
      this._store.clear();
      this._version = cacheVersion;
    }
    const key = JSON.stringify({ f: filters, q: searchQuery });
    if (this._store.has(key)) return this._store.get(key);
    const result = factory();
    this._store.set(key, result);
    // LRU eviction: cap at 30 entries
    if (this._store.size > 30) {
      const first = this._store.keys().next().value;
      this._store.delete(first);
    }
    return result;
  },

  clear() {
    this._store.clear();
    this._version = -1;
  }
};

// ============================================================
//  OPTIMIZATION LAYER 4: VIRTUAL & INFINITE SCROLLER
//  Keeps the DOM lightweight by rendering only visible question
//  cards plus a small overscan buffer. Uses absolute-height
//  spacer divs to maintain correct scrollbar proportions for
//  100,000+ item lists. Loads data in chunks of 50 as the user
//  approaches the bottom, with duplicate-load prevention.
// ============================================================
class VirtualScroller {
  constructor(container, options) {
    this.container = typeof container === 'string' ? document.getElementById(container) : container;
    this.items = options.items || [];
    this.renderItem = options.renderItem;        // fn(item, index) => HTML string (single root element)
    this.itemHeight = options.itemHeight || 130; // estimated average row height (px)
    this.buffer = options.buffer || 5;           // overscan rows
    this.pageSize = options.pageSize || 50;      // infinite-scroll chunk size
    this.scrollHandler = this.onScroll.bind(this);
    this._range = [-1, -1];
    this.loadedCount = 0;   // how many items are "unlocked" for rendering
    this.loading = false;   // lock to prevent duplicate loadMore calls
    this._nodes = new Map(); // index -> currently-mounted DOM node; lets unchanged rows survive a range update untouched
    this._rafHandle = null;  // coalesces bursts of scroll events into one update per frame
    this._tmp = document.createElement('div'); // scratch element used only to parse an HTML string into a node
  }

  /** Create DOM structure and attach scroll listener. */
  init() {
    if (!this.container) return;
    this.container.style.position = 'relative';
    this.topSpacer = document.createElement('div');
    this.content = document.createElement('div');
    this.bottomSpacer = document.createElement('div');
    this.loader = document.createElement('div');
    this.loader.style.cssText = 'text-align:center;padding:14px;color:var(--text2);font-size:0.85rem;display:none;';
    this.loader.textContent = 'Loading more...';
    this.container.innerHTML = '';
    this.container.appendChild(this.topSpacer);
    this.container.appendChild(this.content);
    this.container.appendChild(this.bottomSpacer);
    this.container.appendChild(this.loader);
    this.container.addEventListener('scroll', this.scrollHandler, { passive: true });
    this.reset(this.items);
  }

  /** Reset with a new item array (e.g., after filter change). */
  reset(newItems) {
    if (newItems) this.items = newItems;
    this.loadedCount = Math.min(this.pageSize, this.items.length);
    this._range = [-1, -1];
    // The underlying item set changed identity, so old mounted nodes no longer
    // correspond to the same logical rows - clear rather than diff across data sets.
    this._nodes.clear();
    if (this.content) this.content.innerHTML = '';
    if (this.container) this.container.scrollTop = 0;
    this.updateRange();
  }

  /** Scroll handler: coalesces rapid scroll events into one update per animation frame. */
  onScroll() {
    if (this._rafHandle) return;
    this._rafHandle = requestAnimationFrame(() => {
      this._rafHandle = null;
      this.updateRange();
    });
  }

  /** Compute the visible+buffered range, trigger infinite load, and patch the DOM to match. */
  updateRange() {
    if (!this.container) return;
    const st = this.container.scrollTop;
    const vh = this.container.clientHeight;
    const totalLoadedHeight = this.loadedCount * this.itemHeight;

    // Smart Scroll Loader: detect near-bottom and load next chunk
    if (st + vh > totalLoadedHeight - this.itemHeight * 4 && this.loadedCount < this.items.length && !this.loading) {
      this.loadMore();
    }

    const start = Math.max(0, Math.floor(st / this.itemHeight) - this.buffer);
    const end = Math.min(this.loadedCount, Math.ceil((st + vh) / this.itemHeight) + this.buffer);
    if (start === this._range[0] && end === this._range[1]) return;
    this._range = [start, end];

    // Adjust spacers so total scrollable height equals full dataset
    this.topSpacer.style.height = (start * this.itemHeight) + 'px';
    this.bottomSpacer.style.height = (Math.max(0, this.items.length - end) * this.itemHeight) + 'px';

    this.patch(start, end);
  }

  /**
   * Reconcile mounted DOM nodes with the new [start, end) range. Rows that
   * remain in range keep their existing node (no destroy/recreate, no lost
   * layout/paint work for them); only rows entering or leaving are touched.
   */
  patch(start, end) {
    for (const [idx, node] of this._nodes) {
      if (idx < start || idx >= end) {
        node.remove();
        this._nodes.delete(idx);
      }
    }
    let ref = this.content.firstChild;
    for (let i = start; i < end; i++) {
      let node = this._nodes.get(i);
      if (!node) {
        node = this._buildNode(i);
        this._nodes.set(i, node);
      }
      if (node !== ref) {
        this.content.insertBefore(node, ref);
      } else {
        ref = ref.nextSibling;
      }
    }
  }

  _buildNode(index) {
    this._tmp.innerHTML = this.renderItem(this.items[index], index);
    const node = this._tmp.firstElementChild;
    this._tmp.innerHTML = '';
    return node || document.createTextNode('');
  }

  /** Append the next page of items (infinite scroll). */
  loadMore() {
    this.loading = true;
    this.loader.style.display = 'block';
    // Yield to browser to paint the loader, then expand
    requestAnimationFrame(() => {
      setTimeout(() => {
        const oldCount = this.loadedCount;
        this.loadedCount = Math.min(this.loadedCount + this.pageSize, this.items.length);
        if (this.loadedCount > oldCount) {
          this.updateRange();
        }
        this.loading = false;
        this.loader.style.display = 'none';
      }, 30);
    });
  }

  /** Clean up event listeners and mounted nodes. */
  destroy() {
    if (this.container) {
      this.container.removeEventListener('scroll', this.scrollHandler);
    }
    if (this._rafHandle) { cancelAnimationFrame(this._rafHandle); this._rafHandle = null; }
    this._nodes.clear();
  }
}

// ============================================================
//  OPTIMIZATION LAYER 5: LAZY RENDERER
//  Defers heavy DOM insertion and analytics calculations using
//  requestIdleCallback (with requestAnimationFrame fallback) so
//  the main thread stays responsive during initial paint.
// ============================================================
const LazyRenderer = {
  queue: [],
  processing: false,

  schedule(fn, priority = 'idle') {
    this.queue.push({ fn, priority });
    if (!this.processing) this.process();
  },

  process() {
    if (!this.queue.length) { this.processing = false; return; }
    this.processing = true;
    const task = this.queue.shift();
    const run = () => {
      try { task.fn(); } catch (e) { console.error('Lazy render error:', e); }
      if (this.queue.length) this.process();
      else this.processing = false;
    };
    if (task.priority === 'idle' && 'requestIdleCallback' in window) {
      requestIdleCallback(run, { timeout: 120 });
    } else {
      requestAnimationFrame(run);
    }
  },

  clear() {
    this.queue = [];
    this.processing = false;
  }
};

        // ============================================================
        //  DATABASE  (Enhanced with Cache Invalidation)
        // ============================================================
        const DB_NAME = 'ENTQuestionBank';
        const DB_VERSION = 8;

        class ENTDatabase {
            constructor() {
                this.db = null;
                // OPTIMIZATION: Expanded cache covers all hot data paths
                this._cache = {
                    questions: null, bookmarks: null, highYield: null,
                    performance: null, examHistory: null, groups: null,
                    books: null, lectures: null, notes: null
                };
                // Cache validity flags — separate from data so we can invalidate cheaply
                this._cacheValid = {
                    questions: false, bookmarks: false, highYield: false,
                    performance: false, examHistory: false, groups: false,
                    books: false, lectures: false, notes: false
                };
                // Monotonic version counter incremented on every write.
                // External systems (FilterCache, SearchIndex) key off this.
                this._cacheVersion = 0;
                this.ready = this.init();
            }

            async init() {
                await window.ENTSubscription.ready;
                window.ENTPaidStorage.bindAccount();
                return new Promise((resolve, reject) => {
                    const request = indexedDB.open(window.ENTSubscription.getAccountDatabaseName(), DB_VERSION);
                    request.onupgradeneeded = (e) => {
                        const db = e.target.result;
                        if (!db.objectStoreNames.contains('questions')) {
                            const qStore = db.createObjectStore('questions', { keyPath: 'id', autoIncrement: true });
                            qStore.createIndex('subject', 'subject', { unique: false });
                            qStore.createIndex('chapter', 'chapter', { unique: false });
                            qStore.createIndex('topic', 'topic', { unique: false });
                            qStore.createIndex('subtopic', 'subtopic', { unique: false });
                            qStore.createIndex('group', 'group', { unique: false });
                            qStore.createIndex('book', 'book', { unique: false });
                        }
                        if (!db.objectStoreNames.contains('examHistory')) db.createObjectStore('examHistory', { keyPath: 'id', autoIncrement: true });
                        if (!db.objectStoreNames.contains('bookmarks')) db.createObjectStore('bookmarks', { keyPath: 'questionId' });
                        if (!db.objectStoreNames.contains('notes')) db.createObjectStore('notes', { keyPath: 'questionId' });
                        if (!db.objectStoreNames.contains('settings')) db.createObjectStore('settings', { keyPath: 'key' });
                        if (!db.objectStoreNames.contains('performance')) db.createObjectStore('performance', { keyPath: 'id', autoIncrement: true });
                        if (!db.objectStoreNames.contains('highYield')) db.createObjectStore('highYield', { keyPath: 'questionId' });
                        if (!db.objectStoreNames.contains('lectures')) {
                            const lStore = db.createObjectStore('lectures', { keyPath: 'id', autoIncrement: true });
                            lStore.createIndex('subject', 'subject', { unique: false });
                            lStore.createIndex('chapter', 'chapter', { unique: false });
                            lStore.createIndex('book', 'book', { unique: false });
                        }
                        // --- Update Package System (v8): new content stores ---
                        if (!db.objectStoreNames.contains('flashcards')) {
                            const fStore = db.createObjectStore('flashcards', { keyPath: 'id', autoIncrement: true });
                            fStore.createIndex('subject', 'subject', { unique: false });
                            fStore.createIndex('chapter', 'chapter', { unique: false });
                            fStore.createIndex('uid', 'uid', { unique: false });
                        }
                        if (!db.objectStoreNames.contains('bookMeta')) {
                            const bmStore = db.createObjectStore('bookMeta', { keyPath: 'id', autoIncrement: true });
                            bmStore.createIndex('uid', 'uid', { unique: false });
                        }
                        if (!db.objectStoreNames.contains('assets')) {
                            db.createObjectStore('assets', { keyPath: 'assetKey' });
                        }
                        if (!db.objectStoreNames.contains('backups')) {
                            db.createObjectStore('backups', { keyPath: 'id', autoIncrement: true });
                        }
                        // 'uid' index on pre-existing content stores, added for devices upgrading from v7 or earlier
                        const tx = e.target.transaction;
                        const qStoreUpgrade = tx.objectStore('questions');
                        if (!qStoreUpgrade.indexNames.contains('uid')) qStoreUpgrade.createIndex('uid', 'uid', { unique: false });
                        const lStoreUpgrade = tx.objectStore('lectures');
                        if (!lStoreUpgrade.indexNames.contains('uid')) lStoreUpgrade.createIndex('uid', 'uid', { unique: false });
                    };
                    request.onsuccess = (e) => {
                        this.db = e.target.result;
                        this.db.onversionchange = () => {
                            this.db.close();
                            alert('A newer version of ENT Master Bank is available. Please reload the page.');
                        };
                        resolve();
                    };
                    request.onblocked = () => {
                        console.warn('IndexedDB upgrade blocked by another open tab.');
                    };
                    request.onerror = (e) => reject(e.target.error);
                });
            }

            async ensureReady() { await this.ready; }

            /** Invalidate selected cache keys (or all if null). Bump version. */
            _invalidateCache(keys) {
                this._cacheVersion++;
                if (keys) {
                    keys.forEach(k => this._cacheValid[k] = false);
                } else {
                    Object.keys(this._cacheValid).forEach(k => this._cacheValid[k] = false);
                }
            }

            async addQuestion(q) {
                normalizeQuestionClassification(q, { infer: false });
                this._invalidateCache(['questions', 'groups', 'books']);
                await this.ensureReady();
                return new Promise((resolve, reject) => {
                    const tx = this.db.transaction('questions', 'readwrite');
                    q.dateAdded = new Date().toISOString();
                    q.tags = q.tags || [];
                    if (!q.group) q.group = '';
                    if (!q.book) q.book = '';
                    const req = tx.objectStore('questions').add(q);
                    req.onsuccess = (e) => resolve(e.target.result);
                    req.onerror = (e) => reject(e.target.error);
                    tx.onerror = (e) => reject(tx.error || e.target.error);
                });
            }

            async getAllQuestions() {
                await this.ensureReady();
                if (!window.ENTSubscription.canAccess()) return [];
                if (this._cacheValid.questions && this._cache.questions) return this._cache.questions;
                return new Promise(resolve => {
                    this.db.transaction('questions', 'readonly').objectStore('questions').getAll().onsuccess = (e) => {
                        this._cache.questions = e.target.result;
                        this._cacheValid.questions = true;
                        resolve(e.target.result);
                    };
                });
            }

            async getQuestion(id) {
                await this.ensureReady();
                if (!window.ENTSubscription.canAccess()) return null;
                return new Promise(resolve => {
                    this.db.transaction('questions', 'readonly').objectStore('questions').get(id).onsuccess = (e) => resolve(e.target.result);
                });
            }

            async deleteQuestion(id) {
                this._invalidateCache(['questions', 'bookmarks', 'highYield', 'groups', 'books']);
                await this.ensureReady();
                return new Promise(resolve => {
                    const tx = this.db.transaction(['questions', 'bookmarks', 'notes'], 'readwrite');
                    tx.objectStore('questions').delete(id);
                    tx.objectStore('bookmarks').delete(id);
                    tx.objectStore('notes').delete(id);
                    tx.oncomplete = () => resolve();
                });
            }

            async toggleBookmark(qid) {
                this._invalidateCache(['bookmarks']);
                await this.ensureReady();
                return new Promise(resolve => {
                    const tx = this.db.transaction('bookmarks', 'readwrite');
                    const store = tx.objectStore('bookmarks');
                    const get = store.get(qid);
                    get.onsuccess = () => {
                        if (get.result) { store.delete(qid); resolve(false); }
                        else { store.add({ questionId: qid }); resolve(true); }
                    };
                });
            }

            async isBookmarked(qid) {
                await this.ensureReady();
                return new Promise(resolve => {
                    this.db.transaction('bookmarks', 'readonly').objectStore('bookmarks').get(qid).onsuccess = (e) => resolve(!!e.target.result);
                });
            }

            async getAllBookmarkedIds() {
                await this.ensureReady();
                if (this._cacheValid.bookmarks && this._cache.bookmarks) return this._cache.bookmarks;
                return new Promise(resolve => {
                    this.db.transaction('bookmarks', 'readonly').objectStore('bookmarks').getAll().onsuccess = (e) => {
                        this._cache.bookmarks = e.target.result.map(b => b.questionId);
                        this._cacheValid.bookmarks = true;
                        resolve(this._cache.bookmarks);
                    };
                });
            }

            async saveExamResult(result) {
                this._invalidateCache(['examHistory']);
                try {
                    await this.ensureReady();
                    return new Promise((resolve, reject) => {
                        result.date = new Date().toISOString();
                        const tx = this.db.transaction('examHistory', 'readwrite');
                        tx.objectStore('examHistory').add(result).onsuccess = (e) => resolve(e.target.result);
                        tx.onerror = (e) => resolve(null);
                    });
                } catch(e) { console.error("Error saving exam result", e); }
            }

            async getExamHistory() {
                await this.ensureReady();
                if (this._cacheValid.examHistory && this._cache.examHistory) return this._cache.examHistory;
                return new Promise(resolve => {
                    this.db.transaction('examHistory', 'readonly').objectStore('examHistory').getAll().onsuccess = (e) => {
                        this._cache.examHistory = (e.target.result || []).reverse();
                        this._cacheValid.examHistory = true;
                        resolve(this._cache.examHistory);
                    };
                });
            }

            async getSetting(key, def = null) {
                await this.ensureReady();
                return new Promise(resolve => {
                    const tx = this.db.transaction('settings', 'readonly');
                    tx.objectStore('settings').get(key).onsuccess = (e) => resolve(e.target.result ? e.target.result.value : def);
                });
            }

            async setSetting(key, value) {
                await this.ensureReady();
                return new Promise(resolve => {
                    this.db.transaction('settings', 'readwrite').objectStore('settings').put({ key, value });
                    resolve();
                });
            }

            // ============================================================
            //  MIGRATION: legacy classification -> Scott-Brown taxonomy
            //  In-place field update only (get -> mutate -> put, same id).
            //  Never deletes or re-adds a question, so bookmarks, notes,
            //  highYield flags and exam/performance history - all keyed by
            //  question id, none of them by subject/chapter - are
            //  completely unaffected.
            //
            //  Idempotent and safe to call on every app start: a question
            //  is only ever touched once (gated on classificationStatus
            //  being unset), so questions imported later still get picked
            //  up on a future run without re-processing anything already
            //  migrated. No answers, explanations, source fields, tags,
            //  topic, or subtopic are read or written here.
            // ============================================================
            // Reconcile exact source metadata once per policy version; preserve row identities.
            async migrateToScottBrown() {
                await this.ensureReady();
                const questions = await this.getAllQuestions();
                const report = { total: questions.length, classified: 0, subjectOnly: 0, unmapped: 0, alreadyDone: 0 };
                const pending = [];
                for (const original of questions) {
                    if (original.classificationPolicyVersion >= 2) { report.alreadyDone++; continue; }
                    const q = { ...original };
                    normalizeQuestionClassification(q, { readNested: isGenericQuestionSubject(q.subject), recoverLegacy: true });
                    if (CLASSIFICATION_MODE === 'admin') generateTopicSubtopic(q);
                    if (q.subject !== original.subject || q.chapter !== original.chapter) {
                        if (q.legacySubject == null) q.legacySubject = original.subject;
                        if (q.legacyChapter == null) q.legacyChapter = original.chapter;
                    }
                    if (isQuestionClassificationApproved(q)) report.classified++;
                    else if (!isGenericQuestionSubject(q.subject)) report.subjectOnly++;
                    else report.unmapped++;
                    pending.push(q);
                }
                if (!pending.length) return report;
                return new Promise((resolve, reject) => {
                    const tx = this.db.transaction('questions', 'readwrite');
                    pending.forEach(q => tx.objectStore('questions').put(q));
                    tx.oncomplete = () => { this._invalidateCache(); resolve(report); };
                    tx.onerror = () => reject(tx.error);
                    tx.onabort = () => reject(tx.error);
                });
            }

            // AUTO-CATEGORIZATION ENABLED BULK IMPORT
            async bulkImport(questions, groupName = '') {
                this._invalidateCache(); // full invalidation on bulk import
                await this.ensureReady();
                const existingQuestions = await this.getAllQuestions();
                const existingSet = new Set(
                    existingQuestions.map(e => ((e.questionText||'').replace(/\s+/g,' ').replace(/[^a-z0-9 ]/gi,'').trim().toLowerCase()))
                );
                const canonicalSubjects = new Map(), canonicalChapters = new Map();
                const rememberClassification = q => {
                    const subjectKey = questionClassificationKey(q.subject);
                    if (!isGenericQuestionSubject(q.subject)) canonicalSubjects.set(subjectKey, q.subject);
                    if (!isGenericQuestionChapter(q.chapter)) canonicalChapters.set(subjectKey + '||' + questionClassificationKey(q.chapter), q.chapter);
                };
                existingQuestions.forEach(rememberClassification);
                return new Promise((resolve, reject) => {
                    const tx = this.db.transaction('questions', 'readwrite');
                    const store = tx.objectStore('questions');
                    let count = 0;
                    for (const q of questions) {
                        normalizeQuestionClassification(q);
                        // Reuse existing custom names so casing/spacing cannot split a topic.
                        if (!q.subjectId) q.subject = canonicalSubjects.get(questionClassificationKey(q.subject)) || q.subject;
                        if (!q.chapterId) q.chapter = canonicalChapters.get(questionClassificationKey(q.subject) + '||' + questionClassificationKey(q.chapter)) || q.chapter;
                        if (q.classification && typeof q.classification === 'object') {
                            q.classification = { ...q.classification, subject: q.subject, chapter: q.chapter };
                        }
                        rememberClassification(q);
                        generateTopicSubtopic(q);
                        q.dateAdded = q.dateAdded || new Date().toISOString();
                        q.tags = q.tags || [];
                        if (groupName && !q.book) q.book = groupName;
                        if (groupName && !q.group) q.group = groupName;
                        if (!q.group) q.group = '';

                        const normalizedNew = (q.questionText||'').replace(/\s+/g,' ').replace(/[^a-z0-9 ]/gi,'').trim().toLowerCase();
                        let duplicate = false;
                        try {
                            duplicate = existingSet.has(normalizedNew);
                            if (!duplicate) {
                                existingSet.add(normalizedNew);
                                store.add(q);
                                count++;
                            }
                        } catch(err) {
                            store.add(q);
                            count++;
                        }
                    }
                    tx.oncomplete = () => { this._invalidateCache(); resolve(count); };
                    tx.onerror = () => reject(tx.error);
                });
            }

            async deleteQuestionsByGroup(groupName) {
                this._invalidateCache(['questions', 'groups', 'books', 'bookmarks', 'highYield']);
                await this.ensureReady();
                const questions = await this.getAllQuestions();
                const targets = questions.filter(q => (q.group||'') === groupName);
                for (const q of targets) {
                    await this.deleteQuestion(q.id);
                }
                return targets.length;
            }

            async deleteQuestionsByBook(bookName) {
                this._invalidateCache(['questions', 'groups', 'books', 'bookmarks', 'highYield']);
                await this.ensureReady();
                const questions = await this.getAllQuestions();
                const targets = questions.filter(q => (q.book || '') === bookName);
                for (const q of targets) {
                    await this.deleteQuestion(q.id);
                }
                return targets.length;
            }

            async clearAllQuestions() {
                this._invalidateCache();
                await this.ensureReady();
                return new Promise(resolve => {
                    const tx = this.db.transaction(['questions', 'bookmarks', 'notes', 'examHistory','performance','highYield'], 'readwrite');
                    tx.objectStore('questions').clear();
                    tx.objectStore('bookmarks').clear();
                    tx.objectStore('notes').clear();
                    tx.objectStore('examHistory').clear();
                    tx.objectStore('performance').clear();
                    tx.objectStore('highYield').clear();
                    tx.oncomplete = () => resolve();
                });
            }

            async exportAllData() {
                await this.ensureReady();
                const stores = ['questions','examHistory','bookmarks','notes','performance','highYield','lectures','settings','flashcards','bookMeta','assets'].filter(s => this.db.objectStoreNames.contains(s));
                const data = await new Promise((resolve,reject) => {
                    const tx = this.db.transaction(stores,'readonly'), result = {};
                    for (const s of stores) tx.objectStore(s).getAll().onsuccess = e => { result[s] = e.target.result || []; };
                    tx.oncomplete = () => resolve(result); tx.onerror = () => reject(tx.error); tx.onabort = () => reject(tx.error);
                });
                data.assets = await QuestionImages.serializeAssets(data.assets || []);
                return { version: DB_VERSION, imageBackupVersion: 1, exportedAt: new Date().toISOString(), ...data };
            }

            async clearAndRestore(data) { return this.restoreSnapshotData(data); }

            // Used by the explicit backup/restore flow and package rollback in both editions.
            async restoreSnapshotData(data) {
                await this.ensureReady();
                if (!data || typeof data !== 'object' || !Array.isArray(data.questions)) throw new Error('Invalid backup question data.');
                const stores = ['questions','examHistory','bookmarks','notes','performance','highYield','lectures','settings','flashcards','bookMeta','assets'].filter(s => this.db.objectStoreNames.contains(s) && (s !== 'settings' || Array.isArray(data.settings)));
                const prepared = {};
                for (const s of stores) { if (data[s] != null && !Array.isArray(data[s])) throw new Error('Invalid backup store: '+s); prepared[s] = (data[s] || []).map(row => typeof row === 'object' && row ? { ...row } : row); }
                prepared.assets = await QuestionImages.deserializeAssets(data.assets || []);
                prepared.bookmarks = (data.bookmarks || []).map(row => typeof row === 'number' ? { questionId: row } : { ...row });
                const assets = new Map(prepared.assets.map(a => [a.assetKey,a]));
                for (const q of prepared.questions) {
                    if (!q || typeof q !== 'object') throw new Error('Invalid backup question.');
                    if (!q.images) continue;
                    await QuestionImages.validateDrafts(q.images);
                    for (const image of QuestionImages.descriptors(q)) {
                        const asset = assets.get(q.uid+'::'+image.path);
                        if (!asset) throw new Error('The backup is missing an attached question image.');
                        await QuestionImages.validateImageBlob(asset.blob,image);
                    }
                }
                await new Promise((resolve,reject) => {
                    const tx = this.db.transaction(stores,'readwrite');
                    tx.oncomplete=resolve; tx.onerror=()=>reject(tx.error); tx.onabort=()=>reject(tx.error);
                    try { for (const s of stores) { const store=tx.objectStore(s); store.clear(); for (const row of prepared[s] || []) store.put(row); } }
                    catch(e) { tx.abort(); reject(e); }
                });
                this._invalidateCache();
            }

            async getAllGroups() {
                await this.ensureReady();
                if (this._cacheValid.groups && this._cache.groups) return this._cache.groups;
                const qs = await this.getAllQuestions();
                const groups = new Set();
                qs.forEach(q => { if (q.group) groups.add(q.group); });
                this._cache.groups = [...groups].sort();
                this._cacheValid.groups = true;
                return this._cache.groups;
            }

            async getAllBooks() {
                await this.ensureReady();
                if (this._cacheValid.books && this._cache.books) return this._cache.books;
                const qs = await this.getAllQuestions();
                const books = new Set();
                qs.forEach(q => { if (q.book) books.add(q.book); });
                this._cache.books = [...books].sort();
                this._cacheValid.books = true;
                return this._cache.books;
            }

            async recordPerformance(r) {
                this._invalidateCache(['performance']);
                await this.ensureReady();
                return new Promise(resolve => {
                    const tx = this.db.transaction('performance','readwrite');
                    tx.objectStore('performance').add(r);
                    tx.oncomplete = () => resolve();
                });
            }

            async getPerformance() {
                await this.ensureReady();
                if (this._cacheValid.performance && this._cache.performance) return this._cache.performance;
                return new Promise(resolve => {
                    this.db.transaction('performance','readonly')
                        .objectStore('performance')
                        .getAll().onsuccess = e => {
                            this._cache.performance = e.target.result || [];
                            this._cacheValid.performance = true;
                            resolve(this._cache.performance);
                        };
                });
            }

            async toggleHighYield(qid) {
                this._invalidateCache(['highYield']);
                await this.ensureReady();
                return new Promise(resolve => {
                    const store = this.db.transaction('highYield','readwrite').objectStore('highYield');
                    const req = store.get(qid);
                    req.onsuccess = () => {
                        if (req.result) { store.delete(qid); resolve(false); }
                        else { store.put({questionId: qid, dateAdded:new Date().toISOString()}); resolve(true); }
                    };
                });
            }

            async getAllHighYieldIds() {
                await this.ensureReady();
                if (this._cacheValid.highYield && this._cache.highYield) return this._cache.highYield;
                return new Promise(resolve => {
                    this.db.transaction('highYield','readonly').objectStore('highYield')
                    .getAll().onsuccess = e => {
                        this._cache.highYield = (e.target.result||[]).map(x=>x.questionId);
                        this._cacheValid.highYield = true;
                        resolve(this._cache.highYield);
                    };
                });
            }

            // --- LECTURES ---
            async addLecture(l) {
                this._invalidateCache(['lectures']);
                await this.ensureReady();
                return new Promise((resolve, reject) => {
                    const tx = this.db.transaction('lectures', 'readwrite');
                    l.dateAdded = new Date().toISOString();
                    const req = tx.objectStore('lectures').add(l);
                    req.onsuccess = e => resolve(e.target.result);
                    req.onerror = e => reject(e.target.error);
                });
            }

            async getAllLectures() {
                await this.ensureReady();
                if (!window.ENTSubscription.canAccess()) return [];
                if (this._cacheValid.lectures && this._cache.lectures) return this._cache.lectures;
                return new Promise(resolve => {
                    this.db.transaction('lectures', 'readonly').objectStore('lectures').getAll().onsuccess = e => {
                        this._cache.lectures = e.target.result || [];
                        this._cacheValid.lectures = true;
                        resolve(this._cache.lectures);
                    };
                });
            }

            async getLecture(id) {
                await this.ensureReady();
                if (!window.ENTSubscription.canAccess()) return null;
                return new Promise(resolve => {
                    this.db.transaction('lectures', 'readonly').objectStore('lectures').get(id).onsuccess = e => resolve(e.target.result);
                });
            }

            async deleteLecture(id) {
                this._invalidateCache(['lectures']);
                await this.ensureReady();
                return new Promise(resolve => {
                    this.db.transaction('lectures', 'readwrite').objectStore('lectures').delete(id);
                    resolve();
                });
            }

            async updateLecture(id, data) {
                this._invalidateCache(['lectures']);
                await this.ensureReady();
                return new Promise((resolve, reject) => {
                    const tx = this.db.transaction('lectures', 'readwrite');
                    const store = tx.objectStore('lectures');
                    const getReq = store.get(id);
                    getReq.onsuccess = () => {
                        const l = getReq.result;
                        if (!l) { resolve(false); return; }
                        Object.assign(l, data, { updatedAt: new Date().toISOString() });
                        store.put(l);
                        resolve(true);
                    };
                    getReq.onerror = () => reject(getReq.error);
                });
            }
        }

const db = new ENTDatabase();

        // RBAC: Wrap destructive DB operations
        (function() {
            const wrapAdmin = (fn, name) => {
                return async function(...args) {
                    if (!RBAC.isAdmin()) {
                        showToast('Admin access required.', 'error');
                        if (name === 'bulkImport') return 0;
                        if (name === 'addQuestion') return null;
                        return;
                    }
                    return fn.apply(this, args);
                };
            };
            db.bulkImport = wrapAdmin(db.bulkImport, 'bulkImport');
            db.addQuestion = wrapAdmin(db.addQuestion, 'addQuestion');
            db.deleteQuestion = wrapAdmin(db.deleteQuestion, 'deleteQuestion');
            db.clearAllQuestions = wrapAdmin(db.clearAllQuestions, 'clearAllQuestions');
            db.clearAndRestore = wrapAdmin(db.clearAndRestore, 'clearAndRestore');
            db.deleteQuestionsByGroup = wrapAdmin(db.deleteQuestionsByGroup, 'deleteQuestionsByGroup');
            db.deleteQuestionsByBook = wrapAdmin(db.deleteQuestionsByBook, 'deleteQuestionsByBook');
            db.addLecture = wrapAdmin(db.addLecture, 'addLecture');
            db.deleteLecture = wrapAdmin(db.deleteLecture, 'deleteLecture');
            db.updateLecture = wrapAdmin(db.updateLecture, 'updateLecture');
        })();

// STEP 6 TAXONOMY ENGINE
const ENT_TAXONOMY = {
 Rhinology:['sinus','rhinitis','nasal','nose','polyp','epistaxis','septum','turbinate'],
 Otology:['ear','hearing','cochlea','tinnitus','vertigo','otitis','vestibular'],
 'Head & Neck Surgery':['neck','salivary','pharynx','pharyngitis','oral','swallow'],
 'Laryngology & Voice':['larynx','voice','tracheostomy','sleep apnoea','vocal'],
 'Paediatric ENT':['child','paediatric','pediatric','adenoid','tonsil']
};

// Scientific reference metadata is separate from the question's book/group bucket.
function questionReferenceText(value) {
    if (typeof value === 'string') return value.replace(/\s+/g, ' ').trim();
    if (typeof value === 'number' && Number.isFinite(value)) return String(value);
    return '';
}

function getQuestionReference(question) {
    const q = question && typeof question === 'object' && !Array.isArray(question) ? question : {};
    const text = value => {
        if (typeof value === 'string') return value.replace(/\s+/g, ' ').trim();
        if (typeof value === 'number' && Number.isFinite(value)) return String(value);
        return '';
    };
    const has = field => Object.prototype.hasOwnProperty.call(q, field);
    const legacy = q.reference && typeof q.reference === 'object' && !Array.isArray(q.reference) ? q.reference : {};
    const firstText = values => {
        for (const value of values) {
            const candidate = text(value);
            if (candidate) return candidate;
        }
        return '';
    };
    // An explicitly empty canonical field is an intentional clearing, not a request for fallback.
    const name = has('referenceName') ? text(q.referenceName)
        : firstText([typeof q.reference === 'string' || typeof q.reference === 'number' ? q.reference : '', legacy.name, legacy.book, legacy.title]);
    const edition = has('referenceEdition') ? text(q.referenceEdition)
        : firstText([legacy.edition, q.edition]);
    const page = has('referencePage') ? text(q.referencePage)
        : firstText([legacy.page, legacy.pageNumber, q.pageNumber, q.page]);
    return { name, edition, page, complete: !!(name && edition && page), hasAny: !!(name || edition || page) };
}

function hasCompleteQuestionReference(question) {
    return getQuestionReference(question).complete;
}

function normalizeQuestionReferenceMetadata(question) {
    if (!question || typeof question !== 'object' || Array.isArray(question)) return question;
    const supplied = ['referenceName', 'referenceEdition', 'referencePage', 'reference']
        .some(field => Object.prototype.hasOwnProperty.call(question, field));
    if (!supplied) return question;
    // A supplied citation replaces the whole citation snapshot, so no older component leaks through a merge.
    const reference = getQuestionReference(question);
    question.referenceName = reference.name;
    question.referenceEdition = reference.edition;
    question.referencePage = reference.page;
    return question;
}

function questionReferenceEscape(value) {
    return questionReferenceText(value).replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function renderQuestionReference(question, { admin = false } = {}) {
    const reference = getQuestionReference(question);
    if (!reference.hasAny && !admin) return '';
    const parts = [];
    if (reference.name) parts.push(`<span class="question-reference-name">${questionReferenceEscape(reference.name)}</span>`);
    if (reference.edition) parts.push(`<span class="question-reference-edition">Edition: ${questionReferenceEscape(reference.edition)}</span>`);
    if (reference.page) parts.push(`<span class="question-reference-page">Page: ${questionReferenceEscape(reference.page)}</span>`);
    const missing = admin && !reference.complete
        ? '<span class="badge badge-warning" style="margin-inline-start:8px;">Reference incomplete</span>' : '';
    return `<div class="question-reference" style="margin-top:12px;padding:10px 12px;border:1px solid var(--border);border-radius:8px;font-size:0.85rem;overflow-wrap:anywhere;">
        <strong>Reference</strong>${missing}
        <div style="display:flex;gap:6px 12px;flex-wrap:wrap;margin-top:5px;">${parts.length ? parts.join('') : '<span>Reference not documented.</span>'}</div>
    </div>`;
}

function renderQuestionBookLocation(question) {
    const book = questionReferenceText(question && question.book);
    return book ? `<div class="question-book-location" style="margin-top:10px;font-size:0.75rem;color:var(--text2);">Book / group: ${questionReferenceEscape(book)}</div>` : '';
}

// Question images are immutable local raster assets, separate from question text.
const QuestionImages = (() => {
    const LIMITS = Object.freeze({ inputBytes: 20 * 1024 * 1024, outputBytes: 2 * 1024 * 1024, pixels: 20000000, side: 2048, perRole: 4 });
    const roles = new Set(['question', 'explanation']);
    const ownedUrls = new Map();
    let editor = null, viewer = null, opening = false, closingHistory = false, observerQueued = false;
    const esc = value => String(value == null ? '' : value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
    const uid = () => crypto.randomUUID ? crypto.randomUUID() : 'img-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2);
    function safePath(path) {
        return typeof path === 'string' && path.length <= 180 && /^(?:images\/)?[a-zA-Z0-9][a-zA-Z0-9_.-]*\.(?:png|jpe?g|webp)$/i.test(path) && !path.includes('..');
    }
    function descriptors(q) {
        if (!q || !Array.isArray(q.images)) return [];
        return q.images.map(img => typeof img === 'string' ? { path: img, role: 'question' } : img)
            .filter(img => img && typeof img === 'object' && safePath(img.path) && (!img.role || roles.has(img.role)))
            .map(img => ({ ...img, role: img.role || 'question', caption: typeof img.caption === 'string' ? img.caption.slice(0, 500) : '' }));
    }
    async function rasterMime(blob) {
        if (!(blob instanceof Blob) || !blob.size || blob.size > 5 * 1024 * 1024) throw Error('Invalid image size.');
        const b = new Uint8Array(await blob.slice(0, 16).arrayBuffer());
        if (b.length >= 8 && [137,80,78,71,13,10,26,10].every((v,i) => b[i] === v)) return 'image/png';
        if (b.length >= 3 && b[0] === 255 && b[1] === 216 && b[2] === 255) return 'image/jpeg';
        if (b.length >= 12 && String.fromCharCode(...b.slice(0,4)) === 'RIFF' && String.fromCharCode(...b.slice(8,12)) === 'WEBP') return 'image/webp';
        throw Error('Choose a PNG, JPEG or WebP image.');
    }
    async function decode(blob) {
        const url = URL.createObjectURL(blob);
        try {
            const image = new Image();
            await new Promise((resolve,reject) => { image.onload = resolve; image.onerror = () => reject(Error('This image could not be opened.')); image.src = url; });
            if (!image.naturalWidth || !image.naturalHeight || image.naturalWidth * image.naturalHeight > LIMITS.pixels) throw Error('Image dimensions exceed 20 million pixels.');
            return image;
        } finally { URL.revokeObjectURL(url); }
    }
    async function prepareFile(file, role = 'question') {
        if (!roles.has(role)) throw Error('Invalid image location.');
        if (!(file instanceof Blob) || !file.size || file.size > LIMITS.inputBytes) throw Error('Choose an image smaller than 20 MB.');
        // Sniff before decoding. Larger originals are accepted only for compression here.
        await rasterMime(file.size <= 5 * 1024 * 1024 ? file : file.slice(0,16));
        if (file.type && !['image/png','image/jpeg','image/webp'].includes(file.type.toLowerCase())) throw Error('Choose a PNG, JPEG or WebP image.');
        const image = await decode(file);
        let scale = Math.min(1, LIMITS.side / Math.max(image.naturalWidth,image.naturalHeight));
        const canvas = document.createElement('canvas');
        let blob;
        for (let attempt=0; attempt<5; attempt++) {
            canvas.width = Math.max(1,Math.round(image.naturalWidth*scale)); canvas.height = Math.max(1,Math.round(image.naturalHeight*scale));
            const ctx=canvas.getContext('2d');
            if (!ctx) throw Error('Image processing is not available in this browser.');
            ctx.drawImage(image,0,0,canvas.width,canvas.height);
            blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/webp',.9-attempt*.07));
            if (blob && blob.size <= LIMITS.outputBytes) break;
            scale *= .8;
        }
        if (!blob || blob.size > LIMITS.outputBytes) throw Error('This image is too large after compression. Choose a smaller image.');
        const mime=await rasterMime(blob), ext=({'image/png':'png','image/jpeg':'jpg','image/webp':'webp'})[mime];
        return { descriptor: { path:'images/'+uid()+'.'+ext, role, caption:'', mime, width:canvas.width, height:canvas.height, size:blob.size }, blob };
    }
    async function validateImageBlob(blob,descriptor={}) {
        const mime=await rasterMime(blob), image=await decode(blob);
        if(descriptor.mime && descriptor.mime!==mime)throw Error('Image type does not match its metadata.');
        if(descriptor.width && descriptor.width!==image.naturalWidth)throw Error('Image width does not match its metadata.');
        if(descriptor.height && descriptor.height!==image.naturalHeight)throw Error('Image height does not match its metadata.');
        return {mime,width:image.naturalWidth,height:image.naturalHeight};
    }
    async function readAsset(questionUid,path) {
        if (!questionUid || !safePath(path)) return null;
        await db.ensureReady();
        return new Promise((resolve,reject) => {
            const request=db.db.transaction('assets','readonly').objectStore('assets').get(questionUid+'::'+path);
            request.onsuccess=()=>resolve(request.result || null); request.onerror=()=>reject(request.error);
        });
    }
    function render(q,role='question') {
        const images=descriptors(q).filter(img=>img.role===role);
        if (!images.length) return '';
        return `<div class="question-images" data-image-role="${role}" aria-label="${role==='question'?'Question images':'Explanation images'}">${images.map((img,i)=>
            `<figure class="question-image"><button type="button" class="question-image-open" aria-label="Enlarge ${role} image ${i+1}" disabled><span class="question-image-message">Loading image…</span><img data-image-uid="${esc(q.uid || '')}" data-image-path="${esc(img.path)}" alt="${esc(img.caption || (role==='question'?'Question':'Explanation')+' image '+(i+1))}" hidden decoding="async"></button><figcaption>${esc(img.caption || (role==='question'?'Question':'Explanation')+' image '+(i+1))}<span class="image-enlarge-hint"> · Tap to enlarge</span></figcaption></figure>`
        ).join('')}</div>`;
    }
    function releaseNode(node) { const url=ownedUrls.get(node); if(url){URL.revokeObjectURL(url);ownedUrls.delete(node);} }
    async function hydrate(root=document) {
        const nodes=[...root.querySelectorAll('img[data-image-path]:not([data-image-loading])')];
        await Promise.all(nodes.map(async image=>{
            image.dataset.imageLoading='true';
            const button=image.closest('.question-image-open'), message=button && button.querySelector('.question-image-message');
            try {
                const record=await readAsset(image.dataset.imageUid,image.dataset.imagePath);
                if (!record || !(record.blob instanceof Blob)) throw Error('Image not available on this device.');
                const mime=await rasterMime(record.blob);
                if(!image.isConnected) return;
                const url=URL.createObjectURL(record.blob.type===mime?record.blob:record.blob.slice(0,record.blob.size,mime));
                ownedUrls.set(image,url);
                image.onload=()=>{ if(!image.isConnected){releaseNode(image);return;} image.hidden=false; if(message)message.hidden=true; if(button)button.disabled=false; };
                image.onerror=()=>{releaseNode(image);if(message)message.textContent='Image could not be displayed.';};
                image.src=url;
            } catch(e) { if(message)message.textContent='Image unavailable. Re-import its update package.'; }
        }));
    }
    function closeViewer(fromPop=false) {
        if(!viewer) return;
        const old=viewer; viewer=null;
        if(old.onResize)window.removeEventListener('resize',old.onResize);
        old.root.remove(); URL.revokeObjectURL(old.url); document.body.style.overflow=old.overflow;
        if(old.focus && old.focus.isConnected) old.focus.focus({preventScroll:true});
        if(!fromPop && history.state && history.state.questionImageViewer) {closingHistory=true;history.back();}
    }
    async function openViewer(button) {
        if(viewer || opening || closingHistory || button.disabled) return;
        opening=true;
        try {
        const thumbnail=button.querySelector('img');
        const record=await readAsset(thumbnail.dataset.imageUid,thumbnail.dataset.imagePath);
        if(!record || !button.isConnected) return;
        const mime=await rasterMime(record.blob);
        if(viewer || !button.isConnected) return;
        const url=URL.createObjectURL(record.blob.slice(0,record.blob.size,mime));
        const root=document.createElement('div');
        root.id='questionImageViewer'; root.setAttribute('role','dialog'); root.setAttribute('aria-modal','true'); root.setAttribute('aria-label','Image viewer');
        root.innerHTML=`<div class="image-viewer-toolbar"><span>Image</span><div><button type="button" class="btn btn-sm btn-outline" data-image-zoom="out" aria-label="Zoom out">−</button><button type="button" class="btn btn-sm btn-outline" data-image-zoom="reset">Fit</button><button type="button" class="btn btn-sm btn-outline" data-image-zoom="in" aria-label="Zoom in">+</button><button type="button" class="btn btn-sm btn-primary" id="closeQuestionImageViewer" aria-label="Close image viewer">Close ×</button></div></div><div class="image-viewer-scroll" tabindex="0"><img alt=""></div><div class="image-viewer-caption"></div>`;
        root.querySelector('img').alt=thumbnail.alt; root.querySelector('.image-viewer-caption').textContent=thumbnail.alt;
        const state={root,url,focus:button,overflow:document.body.style.overflow,scale:1,base:0};
        viewer=state; document.body.style.overflow='hidden'; document.body.appendChild(root);
        const img=root.querySelector('img'), scroll=root.querySelector('.image-viewer-scroll');
        const fit=()=>{state.base=Math.max(1,Math.min(img.naturalWidth,scroll.clientWidth-24,(scroll.clientHeight-24)*img.naturalWidth/img.naturalHeight));img.style.width=Math.round(state.base*state.scale)+'px';};
        state.onResize=fit;window.addEventListener('resize',fit);
        img.onload=fit; img.src=url;
        root.querySelector('#closeQuestionImageViewer').onclick=()=>closeViewer();
        root.querySelectorAll('[data-image-zoom]').forEach(b=>b.onclick=()=>{state.scale=b.dataset.imageZoom==='reset'?1:Math.max(1,Math.min(4,state.scale+(b.dataset.imageZoom==='in'?.5:-.5)));fit();});
        root.addEventListener('keydown',e=>{
            if(e.key==='Escape'){e.preventDefault();e.stopPropagation();closeViewer();}
            if(e.key==='Tab'){
                const focusable=[...root.querySelectorAll('button,[tabindex="0"]')], first=focusable[0],last=focusable.at(-1);
                if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
                else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
            }
        });
        history.pushState({...history.state,questionImageViewer:true},'',location.href);
        root.querySelector('#closeQuestionImageViewer').focus();
        } finally { opening=false; }
    }
    function mountEditor(question,root) {
        if(editor)editor.destroy();
        const entries=descriptors(question || {}).map(descriptor=>({descriptor:{...descriptor},blob:null,url:null}));
        const state={root,entries,pending:0,destroyed:false,generation:0,marker:root.querySelector('#imageEditor')};
        const active=()=>!state.destroyed && root.isConnected && document.getElementById('modalContent')===root && !document.getElementById('modalOverlay').classList.contains('hidden') && root.querySelector('#imageEditor')===state.marker;
        function destroy(){state.destroyed=true;state.generation++;for(const e of entries){if(e.url)URL.revokeObjectURL(e.url);e.url=null;}if(editor===api)editor=null;}
        function status(text,error=false){const area=root.querySelector('#imageEditorStatus');if(area){area.textContent=text;area.classList.toggle('image-editor-error',error);}}
        function draw(){
            if(!active())return;
            for(const role of roles){
                const area=root.querySelector(`[data-image-previews="${role}"]`); area.innerHTML='';
                for(const entry of entries.filter(e=>e.descriptor.role===role)){
                    const card=document.createElement('div');card.className='image-editor-card';card.dataset.imageRole=role;
                    const img=document.createElement('img');img.alt=entry.descriptor.caption || 'Attached image';
                    if(entry.url)img.src=entry.url;
                    else readAsset(question && question.uid,entry.descriptor.path).then(async rec=>{if(!rec || !active() || !card.isConnected)return;await rasterMime(rec.blob);if(!active()||!card.isConnected)return;entry.url=URL.createObjectURL(rec.blob);img.src=entry.url;}).catch(()=>{img.alt='Image unavailable';});
                    const label=document.createElement('label');label.textContent='Caption / description';
                    const caption=document.createElement('input');caption.type='text';caption.maxLength=500;caption.value=entry.descriptor.caption || '';caption.setAttribute('aria-label','Image caption');caption.oninput=()=>entry.descriptor.caption=caption.value;
                    const remove=document.createElement('button');remove.type='button';remove.className='btn btn-sm btn-danger';remove.dataset.imageRemove=entry.descriptor.path;remove.textContent='Remove image';remove.onclick=()=>{const i=entries.indexOf(entry);if(i>=0)entries.splice(i,1);if(entry.url)URL.revokeObjectURL(entry.url);entry.url=null;draw();};
                    card.append(img,label,caption,remove);area.appendChild(card);
                }
            }
            const save=root.querySelector('#saveQuestionBtn');if(save)save.disabled=state.pending>0;
            root.querySelectorAll('#addQuestionImages,#addExplanationImages').forEach(input=>input.disabled=state.pending>0);
        }
        async function attach(input,role){
            const files=[...input.files];input.value='';
            if(!active()||!files.length||state.pending)return;
            if(entries.filter(e=>e.descriptor.role===role).length+files.length>LIMITS.perRole){status('Add up to 4 images for the question and 4 for its explanation.',true);return;}
            const generation=state.generation;state.pending++;draw();status('Preparing images…');
            try{
                const prepared=[];
                for(const file of files){prepared.push(await prepareFile(file,role));if(!active()||state.generation!==generation)return;}
                for(const item of prepared)entries.push({...item,url:URL.createObjectURL(item.blob)});
                status('Images ready. They will be saved with this question.');
            }catch(e){if(active())status(e.message || 'Image could not be prepared.',true);}
            finally{state.pending--;if(active())draw();}
        }
        const api={entries,get busy(){return state.pending>0;},active,images:()=>entries.map(e=>({...e.descriptor})),assets:()=>entries.filter(e=>e.blob).map(e=>({path:e.descriptor.path,blob:e.blob})),destroy};
        editor=api;
        root.querySelector('#addQuestionImages').onchange=e=>attach(e.target,'question');
        root.querySelector('#addExplanationImages').onchange=e=>attach(e.target,'explanation');
        draw();return api;
    }
    function editorMarkup(){return `<fieldset id="imageEditor" class="image-editor"><legend>Images</legend><p>PNG, JPEG or WebP · up to 4 images per section. Images are resized for offline use.</p><label for="addQuestionImages">Question images — shown during practice</label><input id="addQuestionImages" type="file" accept="image/png,image/jpeg,image/webp" multiple><div class="image-editor-previews" data-image-previews="question"></div><label for="addExplanationImages">Explanation images — shown after revealing the answer</label><input id="addExplanationImages" type="file" accept="image/png,image/jpeg,image/webp" multiple><div class="image-editor-previews" data-image-previews="explanation"></div><p id="imageEditorStatus" role="status" aria-live="polite"></p></fieldset>`;}
    async function validateDrafts(images,assets=[]) {
        if(!Array.isArray(images) || images.length>8 || descriptors({images}).length!==images.length)throw Error('Invalid question image metadata.');
        for(const role of roles)if(descriptors({images}).filter(x=>x.role===role).length>LIMITS.perRole)throw Error('Too many images in one section.');
        const paths=new Set();for(const img of images){const path=typeof img==='string'?img:img.path;if(paths.has(path))throw Error('Repeated image path.');paths.add(path);}
        const assetPaths=new Set();
        for(const a of assets){if(!a||!paths.has(a.path)||!(a.blob instanceof Blob)||assetPaths.has(a.path))throw Error('Invalid image attachment.');assetPaths.add(a.path);await validateImageBlob(a.blob,descriptors({images}).find(img=>img.path===a.path));}
    }
    async function validateReferences(questionUid,images,assets=[]) {
        const additions=new Map(assets.map(a=>[a.path,a.blob]));
        for(const image of descriptors({images})){
            const existing=await readAsset(questionUid,image.path), fresh=additions.get(image.path);
            if(!fresh && (!existing || !(existing.blob instanceof Blob)))throw Error('An attached image is missing. Remove it or re-import its update package.');
            if(fresh && existing && existing.blob instanceof Blob){
                const digest=async blob=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',await blob.arrayBuffer()))).join(',');
                if(await digest(fresh)!==await digest(existing.blob))throw Error('A replacement image must use a new image path.');
            }
            if(!fresh)await validateImageBlob(existing.blob,image);
        }
    }
    async function serializeAssets(rows){
        return Promise.all(rows.map(async rec=>{
            if(!(rec.blob instanceof Blob)){
                if(rec.blobDataUrl)return {...rec};
                throw Error('An image asset could not be backed up.');
            }
            const blobDataUrl=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=()=>reject(r.error);r.readAsDataURL(rec.blob);});
            const out={...rec,blobDataUrl};delete out.blob;return out;
        }));
    }
    async function deserializeAssets(rows){
        if(!Array.isArray(rows))throw Error('Invalid backup assets.');
        return Promise.all(rows.map(async rec=>{
            if(!rec||typeof rec.assetKey!=='string')throw Error('Invalid backup asset key.');
            if(rec.blob instanceof Blob)return {...rec};
            if(typeof rec.blobDataUrl!=='string')throw Error('Missing image bytes in backup.');
            const m=/^data:([a-zA-Z0-9.+/-]*);base64,([a-zA-Z0-9+/=\s]*)$/.exec(rec.blobDataUrl);
            if(!m)throw Error('Invalid backup image data.');
            let raw;try{raw=atob(m[2]);}catch{throw Error('Invalid backup image data.');}
            const bytes=Uint8Array.from(raw,c=>c.charCodeAt(0)), out={...rec,blob:new Blob([bytes],{type:m[1]||'application/octet-stream'})};delete out.blobDataUrl;return out;
        }));
    }
    function initialize(){
        document.addEventListener('click',e=>{const button=e.target.closest('.question-image-open');if(button&&!button.disabled)openViewer(button).catch(()=>showToast('Image could not be opened.','error'));});
        window.addEventListener('popstate',e=>{if(closingHistory){closingHistory=false;e.stopImmediatePropagation();return;}if(viewer){closeViewer(true);e.stopImmediatePropagation();}},true);
        new MutationObserver(records=>{
            if(editor&&!editor.active())editor.destroy();
            for(const [node] of ownedUrls)if(!node.isConnected)releaseNode(node);
            if(!records.some(r=>r.type==='childList'&&r.addedNodes.length)||observerQueued)return;
            observerQueued=true;queueMicrotask(()=>{observerQueued=false;hydrate().catch(()=>{});});
        }).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
        window.addEventListener('pagehide',e=>{if(e.persisted)return;for(const [node]of ownedUrls)releaseNode(node);if(editor)editor.destroy();if(viewer)closeViewer(true);});
    }
    initialize();
    return {LIMITS,newUid:uid,safePath,descriptors,rasterMime,validateImageBlob,prepareFile,readAsset,render,hydrate,mountEditor,editorMarkup,validateDrafts,validateReferences,serializeAssets,deserializeAssets,closeViewer,get editor(){return editor;}};
})();


const CLASSIFICATION_MODE = 'student';
// Classification policy v2: the admin approves suggestions; students only consume metadata.
function questionClassificationKey(value) {
    return String(value == null ? '' : value).normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
        .toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9\u0600-\u06ff]+/g, ' ').trim().replace(/\s+/g, ' ');
}
function isGenericQuestionSubject(value) {
    return ['', 'ent', 'e n t', 'general', 'general ent', 'unknown', 'unclassified', 'uncategorized', 'uncategorised',
        'all', 'all subjects', 'ear nose and throat', 'ear nose throat', 'otorhinolaryngology',
        'عام', 'العام', 'غير مصنف', 'غير مصنفة', 'غير محدد', 'غير محددة', 'كل التخصصات'].includes(questionClassificationKey(value));
}
function isGenericQuestionChapter(value) {
    return isGenericQuestionSubject(value) || ['all chapters', 'كل الفصول', 'الفصل العام'].includes(questionClassificationKey(value));
}
function isQuestionClassificationApproved(q) {
    return !!q && !isGenericQuestionSubject(q.subject) && !isGenericQuestionChapter(q.chapter)
        && q.classificationApproved === true && q.classificationStatus === 'classified'
        && q.needsReview !== true && q.classificationInferred !== true;
}
function normalizeQuestionClassification(q, { readNested = true, infer = CLASSIFICATION_MODE === 'admin', recoverLegacy = false, approve = false } = {}) {
    if (!q || typeof q !== 'object' || Array.isArray(q)) return q;
    const admin = CLASSIFICATION_MODE === 'admin';
    // A caller cannot accidentally turn student classification into a text-based classifier.
    infer = admin && infer === true;
    approve = admin && approve === true;
    if (approve) infer = false;
    const clean = value => typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
    const key = questionClassificationKey;
    let index = normalizeQuestionClassification._index;
    if (!index) {
        const stopWords = new Set(('and of the in to for with on at by from an a management assessment disorders disorder conditions condition disease diseases surgery surgical anatomy physiology acute chronic clinical evaluation treatment diagnosis investigation investigations introduction approaches approach complications complication patients patient adult adults children child paediatric pediatric relating overview related including gland glands which what where when most common cause following finding findings type types used using before after during results features general aspects').split(' '));
        index = { subjects: new Map(), subjectIds: new Map(), chapters: new Map(), chapterIds: new Map(), targets: [], subjectTitles: [] };
        const addName = (name, target) => {
            const k = key(name);
            if (!k) return;
            if (!index.chapters.has(k)) index.chapters.set(k, []);
            const list = index.chapters.get(k);
            if (!list.some(t => t.chapterId === target.chapterId)) list.push(target);
        };
        for (const subject of SCOTT_BROWN_TAXONOMY) {
            index.subjectIds.set(key(subject.subjectId), subject);
            index.subjects.set(key(subject.subject), subject);
            index.subjects.set(key(subject.subjectId), subject);
            index.subjectTitles.push({ subjectId: subject.subjectId, titleKey: key(subject.subject) });
            const addChapter = (chapter, partId = null) => {
                const target = { ...chapter, subject: subject.subject, subjectId: subject.subjectId, partId };
                target.titleKey = key(chapter.chapter);
                target.keywords = [...new Set(target.titleKey.split(' ').filter(w => w.length > 3 && !stopWords.has(w)))];
                index.targets.push(target);
                index.chapterIds.set(key(chapter.chapterId), target);
                addName(chapter.chapter, target);
            };
            (subject.chapters || []).forEach(c => addChapter(c));
            (subject.parts || []).forEach(p => (p.chapters || []).forEach(c => addChapter(c, p.partId)));
        }
        for (const [name, legacy] of Object.entries(LEGACY_CLASSIFICATION_MAP)) {
            const subject = index.subjectIds.get(key(legacy.subjectId));
            if (subject) index.subjects.set(key(name), subject);
            for (const [chapter, chapterId] of Object.entries(legacy.chapters || {})) {
                const target = index.chapterIds.get(key(chapterId));
                if (target) addName(chapter, target);
            }
        }
        index.subjectSignals = Object.entries(ENT_TAXONOMY).map(([name, words]) => ({
            subjectId: index.subjects.get(key(name))?.subjectId,
            words: words.map(key), weight: 2
        })).filter(entry => entry.subjectId);
        for (const [subjectId, words] of Object.entries({
            head_neck_endocrine: ['thyroid', 'parathyroid', 'endocrine'],
            anterior_skull_base: ['anterior skull base', 'anterior cranial fossa', 'pituitary', 'parasellar', 'clivus'],
            lateral_skull_base: ['lateral skull base', 'vestibular schwannoma', 'jugular foramen']
        })) if (index.subjectIds.has(key(subjectId))) index.subjectSignals.push({ subjectId, words: words.map(key), weight: 4 });
        normalizeQuestionClassification._index = index;
    }

    const nested = q.classification && typeof q.classification === 'object' && !Array.isArray(q.classification) ? q.classification : null;
    if (readNested && nested) {
        const beforeSubject = clean(q.subject);
        const canUseNestedSubject = admin || isGenericQuestionSubject(beforeSubject);
        if (clean(nested.subject) && canUseNestedSubject
            && (!isGenericQuestionSubject(nested.subject) || isGenericQuestionSubject(beforeSubject))) q.subject = nested.subject;
        const flatSubject = index.subjects.get(key(q.subject));
        const nestedSubject = index.subjects.get(key(nested.subject));
        const sameSubject = isGenericQuestionSubject(nested.subject) || key(q.subject) === key(nested.subject)
            || (flatSubject && nestedSubject && flatSubject.subjectId === nestedSubject.subjectId);
        if (clean(nested.chapter) && (admin || isGenericQuestionChapter(q.chapter)) && sameSubject
            && (!isGenericQuestionChapter(nested.chapter) || isGenericQuestionChapter(q.chapter))) q.chapter = nested.chapter;
        for (const field of ['topic', 'subtopic']) if (clean(nested[field]) && (admin || !clean(q[field]))) q[field] = nested[field];
        for (const field of ['subjectId', 'chapterId']) if (clean(nested[field]) && (admin || !clean(q[field]))) q[field] = nested[field];
        // Flat approval metadata takes precedence over stale nested flags. Missing metadata is retained from packages.
        for (const field of ['classificationInferred', 'classificationApproved', 'classificationSource', 'classificationStatus', 'classificationPolicyVersion', 'needsReview']) {
            if (q[field] == null && nested[field] != null) q[field] = nested[field];
        }
    }

    let subjectText = clean(q.subject), chapterText = clean(q.chapter);
    const hasLegacyEvidence = Object.prototype.hasOwnProperty.call(q, 'legacySubject') && Object.prototype.hasOwnProperty.call(q, 'legacyChapter');
    const nestedHasSpecificMetadata = nested && (!isGenericQuestionSubject(nested.subject) || !isGenericQuestionChapter(nested.chapter));
    // V1 recorded some strong automatic guesses as classified. Generic original labels prove
    // those later meaningful labels were not supplied classification; do not grandfather them in.
    const legacyAutoGuess = recoverLegacy && !(q.classificationPolicyVersion >= 2) && hasLegacyEvidence
        && isGenericQuestionSubject(q.legacySubject) && isGenericQuestionChapter(q.legacyChapter)
        && (!isGenericQuestionSubject(subjectText) || !isGenericQuestionChapter(chapterText))
        && (key(subjectText) !== key(q.legacySubject) || key(chapterText) !== key(q.legacyChapter))
        && q.classificationSource !== 'manual' && !nestedHasSpecificMetadata;
    const wasInferred = legacyAutoGuess || q.classificationInferred === true || ['inferred', 'automatic', 'auto'].includes(q.classificationSource);
    const pendingBefore = wasInferred || q.classificationApproved === false
        || q.needsReview === true || q.classificationStatus === 'needs_review';

    if (recoverLegacy && isGenericQuestionSubject(subjectText) && !isGenericQuestionSubject(q.legacySubject)) subjectText = clean(q.legacySubject);
    if (recoverLegacy && isGenericQuestionChapter(chapterText) && !isGenericQuestionChapter(q.legacyChapter)) {
        const knownSubject = index.subjects.get(key(subjectText));
        const legacySubject = index.subjects.get(key(q.legacySubject));
        const candidates = index.chapters.get(key(q.legacyChapter)) || [];
        const sameLegacySubject = !isGenericQuestionSubject(subjectText) && !isGenericQuestionSubject(q.legacySubject)
            && (key(subjectText) === key(q.legacySubject) || (knownSubject && legacySubject && knownSubject.subjectId === legacySubject.subjectId));
        // An exact unique legacy chapter supplies its own subject when both subject labels are generic.
        // Meaningful current/legacy subject labels still scope recovery and block cross-subject repairs.
        const uniqueUnscopedChapter = isGenericQuestionSubject(subjectText) && isGenericQuestionSubject(q.legacySubject) && candidates.length === 1;
        const safeChapter = candidates.length
            ? uniqueUnscopedChapter || knownSubject && candidates.some(c => c.subjectId === knownSubject.subjectId)
            : sameLegacySubject;
        if (safeChapter) chapterText = clean(q.legacyChapter);
    }
    const explicitSubject = !isGenericQuestionSubject(subjectText);
    const explicitChapter = !isGenericQuestionChapter(chapterText);
    let subject = explicitSubject ? index.subjects.get(key(subjectText)) : null;
    let chapter = null, inferredNow = false, conflict = false;
    const subjectById = index.subjectIds.get(key(q.subjectId));
    const chapterById = index.chapterIds.get(key(q.chapterId));

    if (explicitChapter) {
        const matches = index.chapters.get(key(chapterText)) || [];
        const scoped = subject ? matches.filter(c => c.subjectId === subject.subjectId) : matches;
        if (scoped.length === 1 && (!explicitSubject || subject)) chapter = scoped[0];
        else if (!explicitSubject && scoped.length > 1 && subjectById) {
            const matchingIds = scoped.filter(c => c.subjectId === subjectById.subjectId);
            if (matchingIds.length === 1) chapter = matchingIds[0];
        }
        if (subject && matches.length && !scoped.length) conflict = true;
        if (!explicitSubject && matches.length > 1 && !chapter) conflict = true;
        if (chapter && !explicitSubject) subject = index.subjectIds.get(key(chapter.subjectId));
    } else if (chapterById) {
        // A meaningful subject label wins over IDs left by older migrations.
        const compatibleSubject = subject || (!explicitSubject ? subjectById : null);
        if ((!explicitSubject || subject) && (!compatibleSubject || chapterById.subjectId === compatibleSubject.subjectId)) {
            chapter = chapterById;
            if (!explicitSubject) subject = index.subjectIds.get(key(chapter.subjectId));
        } else if (compatibleSubject) conflict = true;
    }
    if (!subject && !explicitSubject && subjectById) subject = subjectById;

    if (infer && !conflict && ((!subject && !explicitSubject) || (!chapter && !explicitChapter && subject))) {
        const text = ' ' + key([chapterText, q.topic, q.subtopic, q.questionText, q.explanation].filter(Boolean).join(' ')) + ' ';
        const containsKey = phrase => !!phrase && text.includes(' ' + phrase + ' ');
        const scoreChapter = target => containsKey(target.titleKey) ? 100 + target.keywords.length
            : target.keywords.reduce((score, word) => score + (containsKey(word) ? 2 : 0), 0);
        const chapterScores = index.targets.map(target => ({ target, score: scoreChapter(target) }));
        const uniqueBest = scored => {
            let best = null, tied = false;
            for (const entry of scored) {
                if (!best || entry.score > best.score) { best = entry; tied = false; }
                else if (entry.score === best.score) tied = true;
            }
            return best && best.score > 0 && !tied ? best : null;
        };
        if (!subject && !explicitSubject) {
            const scores = new Map();
            const vote = (subjectId, score) => scores.set(subjectId, (scores.get(subjectId) || 0) + score);
            for (const entry of index.subjectSignals) vote(entry.subjectId, entry.words.reduce((n, word) => n + (containsKey(word) ? entry.weight : 0), 0));
            for (const entry of index.subjectTitles) if (containsKey(entry.titleKey)) vote(entry.subjectId, 6);
            for (const entry of chapterScores) if (entry.score >= 100) vote(entry.target.subjectId, 8);
            const best = uniqueBest([...scores].map(([subjectId, score]) => ({ subjectId, score })));
            if (best) subject = index.subjectIds.get(key(best.subjectId));
            else if (![...scores.values()].some(score => score > 0)) {
                const highest = Math.max(0, ...chapterScores.map(c => c.score));
                const subjectIds = new Set(chapterScores.filter(c => c.score === highest && c.score > 0).map(c => c.target.subjectId));
                if (subjectIds.size === 1) subject = index.subjectIds.get(key([...subjectIds][0]));
            }
            if (subject) inferredNow = true;
        }
        if (!chapter && !explicitChapter && subject) {
            const best = uniqueBest(chapterScores.filter(c => c.target.subjectId === subject.subjectId));
            if (best) { chapter = best.target; inferredNow = true; }
        }
    }

    // Student labels supplied by the admin (including custom labels) remain untouched.
    const preserveSubjectLabel = !admin && explicitSubject;
    const preserveChapterLabel = !admin && explicitChapter;
    q.subject = preserveSubjectLabel ? subjectText : subject ? subject.subject : explicitSubject ? subjectText : 'Uncategorized';
    q.chapter = preserveChapterLabel ? chapterText : chapter ? chapter.chapter : explicitChapter ? chapterText : 'General';
    q.subjectId = subject ? subject.subjectId : null;
    q.chapterId = chapter ? chapter.chapterId : null;
    q.chapterNumber = chapter ? chapter.chapterNumber : null;
    q.partId = chapter ? chapter.partId : null;
    const unresolved = isGenericQuestionSubject(q.subject) || isGenericQuestionChapter(q.chapter) || conflict;
    const manuallyApproved = approve && !unresolved;
    q.classificationInferred = manuallyApproved ? false : wasInferred || inferredNow;
    q.needsReview = unresolved || (!manuallyApproved && (pendingBefore || q.classificationInferred));
    q.classificationApproved = !q.needsReview;
    q.classificationStatus = q.needsReview ? 'needs_review' : 'classified';
    q.classificationSource = manuallyApproved ? 'manual' : q.classificationInferred ? 'inferred'
        : q.classificationApproved ? (clean(q.classificationSource) || 'metadata')
        : (clean(q.classificationSource) || 'unresolved');
    q.classificationPolicyVersion = 2;
    q.classificationRepairVersion = 1;
    if (nested) {
        q.classification = Object.assign({}, nested, { subject: q.subject, chapter: q.chapter, subjectId: q.subjectId,
            chapterId: q.chapterId, chapterNumber: q.chapterNumber, partId: q.partId,
            classificationStatus: q.classificationStatus, classificationInferred: q.classificationInferred,
            classificationApproved: q.classificationApproved, classificationSource: q.classificationSource,
            classificationPolicyVersion: q.classificationPolicyVersion, classificationRepairVersion: q.classificationRepairVersion,
            needsReview: q.needsReview });
        for (const field of ['topic', 'subtopic']) if (q[field] != null) q.classification[field] = q[field];
    }
    return q;
}

function classifyQuestionAdvanced(q){
 return normalizeQuestionClassification(q, { readNested: false });
}

// STEP 7 AUTO TOPIC & SUBTOPIC ENGINE
function generateTopicSubtopic(q, { suggest = false } = {}){
 if (CLASSIFICATION_MODE === 'student') return q;
 const text = ((q.questionText || '') + ' ' + (q.explanation || '')).toLowerCase();
 let suggested = false;
 if (!q.topic) {
   let topic = 'General';
   if (suggest) {
     if (text.includes('anatom')) topic = 'Anatomy';
     else if (text.includes('physiology')) topic = 'Physiology';
     else if (text.includes('diagnosis') || text.includes('assessment')) topic = 'Diagnosis';
     else if (text.includes('management') || text.includes('treatment')) topic = 'Management';
     else if (text.includes('surgery') || text.includes('operative')) topic = 'Surgery';
   }
   q.topic = topic;
   suggested = topic !== 'General';
 }
 if (!q.subtopic) {
   let subtopic = 'Core Concepts';
   if (suggest) {
     if (text.includes('complication')) subtopic = 'Complications';
     else if (text.includes('indication')) subtopic = 'Indications';
     else if (text.includes('classification')) subtopic = 'Classification';
     else if (text.includes('imaging')) subtopic = 'Imaging';
   }
   q.subtopic = subtopic;
   suggested = suggested || subtopic !== 'Core Concepts';
 }
 if (suggested) {
   q.classificationInferred = true;
   q.classificationApproved = false;
   q.needsReview = true;
   q.classificationStatus = 'needs_review';
   q.classificationSource = 'suggested';
 }
 if (q.classification && typeof q.classification === 'object') {
   q.classification = { ...q.classification, topic: q.topic, subtopic: q.subtopic,
      classificationInferred: q.classificationInferred, classificationApproved: q.classificationApproved,
      classificationStatus: q.classificationStatus, needsReview: q.needsReview };
 }
 return q;
}

// STEP 8 HIERARCHY ANALYTICS ENGINE
async function buildHierarchyStats(){
 const qs=await db.getAllQuestions();
 const tree={};
 qs.forEach(q=>{
   const s=q.subject||'Uncategorized';
   const c=q.chapter||'General';
   const t=q.topic||'General';
   const st=q.subtopic||'General';
   tree[s]??={};
   tree[s][c]??={};
   tree[s][c][t]??={};
   tree[s][c][t][st]=(tree[s][c][t][st]||0)+1;
 });
 return tree;
}

async function getQuestionsNeedingReview(){
 const qs=await db.getAllQuestions();
 return qs.filter(q=>q.needsReview);
}

// STEP 9 HIERARCHY MANAGEMENT UI

// STEP 10 ADVANCED ANALYTICS + DUPLICATE MANAGER
async function scanDuplicateQuestions(){
 const qs=await db.getAllQuestions();
 const map={}, dup=[];
 qs.forEach(q=>{
   const key=(q.questionText||'').toLowerCase().trim();
   if(map[key]) dup.push(q);
   else map[key]=1;
 });
 return dup;
}

async function generateSubjectAnalytics(){
 const qs=await db.getAllQuestions();
 const stats={};
 qs.forEach(q=>{
   const s=q.subject||'Unknown';
   stats[s]=(stats[s]||0)+1;
 });
 return stats;
}

// STEP 11 DASHBOARD + AI RECOMMENDATIONS
async function buildTopicHeatmap(){
 const qs=await db.getAllQuestions();
 const map={};
 qs.forEach(q=>{
   const k=q.topic||'General';
   map[k]=(map[k]||0)+1;
 });
 return map;
}

async function generateWeakAreaRecommendations(){
 const perf=await db.getPerformance();
 const result=[];
 perf.filter(x=>!x.correct).slice(0,20).forEach(x=>{
   result.push(`${x.subject||'Unknown'} > ${x.chapter||'Unknown'}`);
 });
 return [...new Set(result)];
}

// STEP 12 INTERACTIVE MANAGEMENT + READINESS ENGINE

async function renderBoardReadinessDashboard(){
 const perf=await db.getPerformance();
 const correct=perf.filter(x=>x.correct).length;
 const score=perf.length?Math.round(correct*100/perf.length):0;
 return `<div class="readiness-card"><h3>🎯 Board Readiness</h3><p>${score}% Ready</p></div>`;
}

// STEP 13 ADVANCED AI + EXAM CENTER

// STEP 14 PRODUCTION AI ENGINE

async function adaptiveExamEngine(){
 const perf=await db.getPerformance();
 return perf.filter(x=>!x.correct).length;
}

async function performanceForecastEngine(){
 const perf=await db.getPerformance();
 const acc=perf.length?Math.round((perf.filter(x=>x.correct).length*100)/perf.length):0;
 return `Projected Board Score: ${Math.min(acc+10,100)}%`;
}

// STEP 15 ENTERPRISE RELEASE ENGINE
async function fullBoardExamSimulator(){
 return {
   exams:['Iraqi Board','Arab Board','Mock Exam'],
   status:'enterprise-ready'
 };
}

async function smartQuestionSelector(){
 const perf=await db.getPerformance();
 return perf.filter(x=>!x.correct).slice(0,20);
}

// STEP 16 FINAL PROFESSIONAL BUILD

async function optimizeFor100kQuestions(){
 return {
   virtualization:true,
   indexedSearch:true,
   cacheEnabled:true
 };
}

// STEP 17 ULTIMATE PRODUCTION VERSION v5.0

async function iraqiBoardMockExam(){
 return {
   questions:150,
   timer:true,
   blueprint:'Iraqi Board ENT'
 };
}

// STEP 18 FINAL GOOGLE PLAY RELEASE v6.0
const PLAY_STORE_CONFIG={
 version:'6.0',
 release:'production',
 offline:true,
 pwa:true,
 installable:true
};

// STEP 19 NATIVE ANDROID WRAPPER + APK BUILDER
const ANDROID_BUILD_CONFIG={
 version:'7.0',
 target:'android',
 apk:true,
 aab:true,
 playStore:true
};

/* ===== Reclassification Engine v1 ===== */
async function updateQuestionClassification(questionId, subject, chapter, topic, subtopic, requireAdminCheck = true){
    if (CLASSIFICATION_MODE !== 'admin' || !RBAC.requireAdmin()) return false;
    await db.ensureReady();
    return new Promise((resolve,reject)=>{
        const tx = db.db.transaction('questions','readwrite');
        const store = tx.objectStore('questions');
        let updated = false;
        const getReq = store.get(questionId);
        getReq.onsuccess = ()=>{
            const q = getReq.result;
            if(!q) return;
            q.subject = subject || q.subject;
            q.chapter = chapter || q.chapter;
            q.topic = topic || q.topic;
            q.subtopic = subtopic || q.subtopic;

            // A human's new labels supersede stable IDs from the previous classification.
            q.subjectId = q.chapterId = q.chapterNumber = q.partId = null;
            normalizeQuestionClassification(q, { readNested: false, infer: false, approve: true });

            q.updatedAt = new Date().toISOString();
            store.put(q);
            updated = true;
        };
        getReq.onerror = ()=>reject(getReq.error);
        tx.oncomplete = () => { if (updated) db._invalidateCache(); resolve(updated); };
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(tx.error);
    });
}


        // ============================================================
        //  APP STATE
        // ============================================================
        const AppState = {
            currentView: 'dashboard', darkMode: false,
            examInProgress: false, examShowResults: false,
            examQuestions: [], examAnswers: {}, examTimer: null,
            examTimeRemaining: 0, examStartTime: null,
            studyFilter: { book:'all', subject: 'all', chapter: 'all', topic: 'all', subtopic:'all', group: 'all', mode: 'practice', lectureId: null },
            questionFilters: { subject:'all', chapter:'all', topic:'all', difficulty:'all', special:'all' },
            searchQuery: '', lastExamResults: null,
            studyQuestions: null, studyIndex: 0, studyAnswers: {}, studyRevealed: {}, _examSaved:false,
            // OPTIMIZATION: hold references for virtual scroller and filtered sets
            _questionScroller: null,
            _lastFilteredQuestions: [],
            _lastFilterMeta: {}
        };
        // ============================================================
        //  RBAC — ROLE-BASED ACCESS CONTROL
        // ============================================================
        const RBAC = {
            role: 'student',
            init() {},
            isAdmin() { return false; },
            isStudent() { return true; },
            requireAdmin() { showToast('Admin access required.', 'error'); return false; },
            toggle() {}
        };

        function applyRoleVisibility() {
            const importNav = document.querySelector('.nav-item[data-view="import"]');
            if (importNav) importNav.style.display = RBAC.isAdmin() ? 'flex' : 'none';
            const adminNav = document.querySelector('.nav-item[data-view="admin"]');
            if (adminNav) adminNav.style.display = RBAC.isAdmin() ? 'flex' : 'none';
            const adminBtn = document.getElementById('btnAdminMode');
            if (adminBtn) {
                adminBtn.textContent = RBAC.isAdmin() ? '🔓' : '🔒';
                adminBtn.title = RBAC.isAdmin() ? 'Admin Mode (click to logout)' : 'Admin Login';
            }
        }

        // ============================================================
        //  SESSION AUTO-SAVE / AUTO-RESTORE
        // ============================================================
        const SESSION_STORAGE_KEY = 'entMasterBank_session_v1';
        const SESSION_SCHEMA_VERSION = 1;
        const VALID_VIEWS = ['dashboard', 'study', 'exam', 'questions', 'import', 'mistakes', 'highyield', 'admin'];

        let _saveSessionTimer = null;
        function saveSession() {
            if (_saveSessionTimer) clearTimeout(_saveSessionTimer);
            _saveSessionTimer = setTimeout(() => {
                _saveSessionTimer = null;
                _doSaveSession();
            }, 120);
        }
        function _doSaveSession() {
            try {
                const snapshot = {
                    __v: SESSION_SCHEMA_VERSION,
                    savedAt: Date.now(),
                    currentView: AppState.currentView,
                    darkMode: AppState.darkMode,
                    examInProgress: AppState.examInProgress,
                    examShowResults: AppState.examShowResults,
                    examQuestions: AppState.examQuestions,
                    examAnswers: AppState.examAnswers,
                    examTimeRemaining: AppState.examTimeRemaining,
                    examStartTime: AppState.examStartTime,
                    _examSaved: AppState._examSaved,
                    lastExamResults: AppState.lastExamResults,
                    studyFilter: AppState.studyFilter,
                    questionFilters: AppState.questionFilters,
                    searchQuery: AppState.searchQuery,
                    studyQuestions: AppState.studyQuestions,
                    studyIndex: AppState.studyIndex,
                    studyAnswers: AppState.studyAnswers,
                    studyRevealed: AppState.studyRevealed,
                };
                window.ENTPaidStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(snapshot));
            } catch (e) {
                console.warn('Session autosave failed:', e);
            }
        }

        function clearSession() {
            try { window.ENTPaidStorage.removeItem(SESSION_STORAGE_KEY); } catch (e) {}
        }

        function restoreSession() {
            let snapshot;
            try {
                const raw = window.ENTPaidStorage.getItem(SESSION_STORAGE_KEY);
                if (!raw) return false;
                snapshot = JSON.parse(raw);
            } catch (e) {
                console.warn('Saved session was corrupted; starting fresh.', e);
                clearSession();
                return false;
            }
            if (!snapshot || typeof snapshot !== 'object' || snapshot.__v !== SESSION_SCHEMA_VERSION) {
                return false;
            }
            try {
                AppState.currentView = VALID_VIEWS.includes(snapshot.currentView) ? snapshot.currentView : 'dashboard';
                AppState.darkMode = !!snapshot.darkMode;

                if (snapshot.studyFilter && typeof snapshot.studyFilter === 'object') {
                    Object.assign(AppState.studyFilter, snapshot.studyFilter);
                }
                if (snapshot.questionFilters && typeof snapshot.questionFilters === 'object') {
                    Object.assign(AppState.questionFilters, snapshot.questionFilters);
                }
                AppState.searchQuery = typeof snapshot.searchQuery === 'string' ? snapshot.searchQuery : '';

                AppState.examQuestions = Array.isArray(snapshot.examQuestions) ? snapshot.examQuestions : [];
                AppState.examAnswers = (snapshot.examAnswers && typeof snapshot.examAnswers === 'object') ? snapshot.examAnswers : {};
                AppState.examTimeRemaining = Number.isFinite(snapshot.examTimeRemaining) ? Math.max(0, snapshot.examTimeRemaining) : 0;
                AppState.examStartTime = snapshot.examStartTime || null;
                AppState._examSaved = !!snapshot._examSaved;
                AppState.lastExamResults = Array.isArray(snapshot.lastExamResults) ? snapshot.lastExamResults : null;
                AppState.examInProgress = !!snapshot.examInProgress && AppState.examQuestions.length > 0;
                AppState.examShowResults = !!snapshot.examShowResults && Array.isArray(AppState.lastExamResults);

                if (Array.isArray(snapshot.studyQuestions) && snapshot.studyQuestions.length > 0 &&
                    Number.isInteger(snapshot.studyIndex) && snapshot.studyIndex >= 0 &&
                    snapshot.studyIndex < snapshot.studyQuestions.length) {
                    AppState.studyQuestions = snapshot.studyQuestions;
                    AppState.studyIndex = snapshot.studyIndex;
                    AppState.studyAnswers = (snapshot.studyAnswers && typeof snapshot.studyAnswers === 'object') ? snapshot.studyAnswers : {};
                    AppState.studyRevealed = (snapshot.studyRevealed && typeof snapshot.studyRevealed === 'object') ? snapshot.studyRevealed : {};
                }
                return true;
            } catch (e) {
                console.warn('Failed to apply saved session; starting fresh.', e);
                return false;
            }
        }

        function startExamTimer() {
            if (AppState.examTimer) { clearInterval(AppState.examTimer); AppState.examTimer = null; }
            if (!(AppState.examTimeRemaining > 0)) return;
            // Anchored to a wall-clock end time rather than decremented once per
            // tick: mobile browsers throttle/pause setInterval while a tab is
            // backgrounded, so a plain counter silently loses that time. Whenever
            // a tick does fire, it recomputes from Date.now() and is correct
            // regardless of how long the tab was suspended.
            const examEndTime = Date.now() + AppState.examTimeRemaining * 1000;
            AppState.examTimer = setInterval(() => {
                AppState.examTimeRemaining = Math.max(0, Math.round((examEndTime - Date.now()) / 1000));
                const disp = $('#examTimerDisplay');
                if (disp) {
                    disp.textContent = formatTime(AppState.examTimeRemaining);
                    disp.className = 'timer-display' + (AppState.examTimeRemaining < 120 ? ' timer-warning' : '') + (AppState.examTimeRemaining < 60 ? ' timer-danger' : '');
                }
                saveSession();
                if (AppState.examTimeRemaining <= 0) {
                    clearInterval(AppState.examTimer);
                    AppState.examTimer = null;
                    showToast('Time up! Submitting...', 'warning');
                    submitExam();
                }
            }, 1000);
        }

        function cleanupLegacyStorage() {
            try {
                ['ENT_AUTO_BACKUP', 'ent_exam_progress', 'ent_exam_session', 'ent_last_interaction',
                 'ent_runtime_state', 'ent_answers', 'wrongQuestions', 'bookmarks', 'ent_last_question',
                 'entStats'].forEach(k => window.ENTPaidStorage.removeItem(k));
                window.ENTPaidStorage.keys().forEach(k => {
                    if (k.startsWith('reclass_') || k.startsWith('reclassified_')) window.ENTPaidStorage.removeItem(k);
                });
            } catch (e) { }
        }

        // ============================================================
        //  DOM HELPERS
        // ============================================================
        function $(sel) { return document.querySelector(sel); }
        function $$(sel) { return document.querySelectorAll(sel); }

        function escapeHTML(value) {
            return String(value == null ? '' : value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
        }
        function highlightText(value, query) {
            const text = String(value == null ? '' : value);
            if (!query) return escapeHTML(text);
            const needle = String(query).toLocaleLowerCase();
            const lower = text.toLocaleLowerCase();
            let result='', offset=0, found;
            while ((found=lower.indexOf(needle,offset)) !== -1) {
                result+=escapeHTML(text.slice(offset,found))+'<span class="highlight">'+escapeHTML(text.slice(found,found+needle.length))+'</span>';
                offset=found+needle.length;
            }
            return result+escapeHTML(text.slice(offset));
        }

        function formatTime(sec) {
            const m = Math.floor(sec / 60), s = sec % 60;
            return `${m}:${s.toString().padStart(2,'0')}`;
        }

        function showToast(msg, type = 'info') {
            const container = $('#toastContainer');
            const toast = document.createElement('div');
            toast.textContent = msg;
            const bg = type === 'success' ? '#2d8a4e' : type === 'error' ? '#c0392b' : type === 'warning' ? '#d4a017' : '#333';
            toast.style.cssText = `background:${bg};color:#fff;padding:10px 20px;border-radius:20px;margin-bottom:8px;font-weight:600;animation:toastIn 0.3s ease, toastOut 0.3s ease 2.2s forwards;`;
            container.appendChild(toast);
            setTimeout(() => toast.remove(), 2600);
        }

        function closeModal() {
            window.__questionImageFormRequest = (window.__questionImageFormRequest || 0) + 1;
            if (history.state && history.state.modal) {
                history.back(); // popstate handler hides the overlay
            } else {
                $('#modalOverlay').classList.add('hidden');
            }
        }

        // ============================================================
        //  NAVIGATION
        // ============================================================
        // True only while we're reacting to a browser/hardware back-button
        // press, so navigateTo() knows not to push another history entry
        // for a navigation the user didn't just initiate.
        let isPopNavigation = false;

        function navigateTo(view) {
            if (!window.ENTSubscription.canAccess() || view === 'account' || view === 'settings') return renderViewSafely('account');
            window.__questionImageFormRequest = (window.__questionImageFormRequest || 0) + 1;
            AppState.currentView = view;
            if (AppState.examTimer) { clearInterval(AppState.examTimer); AppState.examTimer = null; }
            AppState.examInProgress = false;
            AppState.examShowResults = false;
            $$('.nav-item').forEach(n => n.classList.remove('active'));
            const nav = $(`.nav-item[data-view="${view}"]`);
            if (nav) nav.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            if (!isPopNavigation) {
                history.pushState({ view }, '', location.href);
            }
            return renderViewSafely(view);
        }

        // Handles the hardware/gesture/browser back button. Closes an open
        // modal first if there is one; otherwise steps back to whichever
        // top-level view preceded the current one, instead of exiting the
        // app. An in-progress exam gets a confirmation first so a stray
        // back-press can't silently wipe a timed attempt.
        function handlePopState(e) {
            const overlay = $('#modalOverlay');
            const modalCurrentlyOpen = overlay && !overlay.classList.contains('hidden');
            const state = e.state || {};

            if (modalCurrentlyOpen && !state.modal) {
                overlay.classList.add('hidden');
                return;
            }

            if (AppState.examInProgress) {
                const leave = confirm('Leave the exam? Your progress and timer will be lost.');
                if (!leave) {
                    history.pushState({ view: 'exam' }, '', location.href);
                    return;
                }
            }

            isPopNavigation = true;
            navigateTo(state.view || 'dashboard');
            isPopNavigation = false;
        }

        // ============================================================
        //  RENDER ENGINE
        // ============================================================
        let paidRenderRequest = 0;
        async function renderViewSafely(view) {
            const request = ++paidRenderRequest;
            const main = $('#mainContent');
            if (!main) return;
            if (!window.ENTSubscription.canAccess() || view === 'account' || view === 'settings') {
                $$('.nav-item').forEach(n => n.classList.toggle('active',n.dataset.view === 'account'));
                await window.ENTSubscription.renderAccount(main);
                return;
            }
            try {
                let html;
                switch (view) {
                    case 'dashboard': html = await renderDashboard(); break;
                    case 'study': html = await renderStudy(); break;
                    case 'exam':
                        if (AppState.examInProgress) html = await renderExamInProgress();
                        else if (AppState.examShowResults) html = renderExamResults();
                        else html = await renderExamSetup();
                        break;
                    case 'questions': html = await renderQuestionList(); break;
                    case 'mistakes': html = await renderMistakes(); break;
                    case 'highyield': html = await renderHighYield(); break;
                    default: html = '<div class="card">Unknown view</div>';
                }
                if (request !== paidRenderRequest) return;
                if (!window.ENTSubscription.canAccess()) { await window.ENTSubscription.renderAccount(main); return; }
                main.innerHTML = html;
            } catch (e) {
                if (request !== paidRenderRequest) return;
                console.error('Render error:', e);
                main.innerHTML = '<div class="card text-center"><p>Unable to open this page. Please try again.</p></div>';
            }
            attachEventListeners();
            saveSession();
        }

        // ============================================================
        //  RENDER FUNCTIONS  (Optimized)
        // ============================================================

        /**
         * DASHBOARD — Optimized path:
         * 1. Fetches all hot data via cached DB getters (single IndexedDB read).
         * 2. Renders the static skeleton immediately so the UI paints fast.
         * 3. Offloads heavy analytics (weak topics, subject breakdown) to the
         *    Web Worker, then injects results lazily via requestIdleCallback.
         */
        
        // ============================================================
        //  STUDENT MODE ENHANCEMENTS
        // ============================================================
        const STREAK_KEY = 'ent_study_streak';
        const DAILY_GOAL_KEY = 'ent_daily_goal';
        const DAILY_PROGRESS_KEY = 'ent_daily_progress';
        const LAST_STUDY_DATE_KEY = 'ent_last_study_date';
        const DEFAULT_STREAK_INFO = Object.freeze({
            streak: 0,
            bestStreak: 0,
            totalStudyDays: 0,
            lastDate: null,
            studiedToday: false
        });

        function toNonNegativeInteger(value, fallback = 0) {
            const parsed = Number.parseInt(value, 10);
            return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
        }

        function parseDailyProgress(raw) {
            try {
                const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
                if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
                return Object.fromEntries(
                    Object.entries(parsed).map(([date, count]) => [date, toNonNegativeInteger(count)])
                );
            } catch (e) {
                return {};
            }
        }

        function getBestStreak(progress = {}) {
            const studyDates = Object.entries(progress ?? {})
                .filter(([date, count]) => /^\d{4}-\d{2}-\d{2}$/.test(date) && toNonNegativeInteger(count) > 0)
                .map(([date]) => date)
                .sort();
            let bestStreak = 0;
            let currentRun = 0;
            let previousDay = null;
            studyDates.forEach(date => {
                const day = Date.parse(`${date}T00:00:00Z`);
                currentRun = previousDay !== null && day - previousDay === 86400000 ? currentRun + 1 : 1;
                bestStreak = Math.max(bestStreak, currentRun);
                previousDay = day;
            });
            return bestStreak;
        }

        async function getDailyProgressMap() {
            try {
                return parseDailyProgress(await db.getSetting(DAILY_PROGRESS_KEY, '{}'));
            } catch (e) {
                return {};
            }
        }

        async function getStudyStreak() {
            try {
                const [raw, lastRaw, progress] = await Promise.all([
                    db.getSetting(STREAK_KEY, '0'),
                    db.getSetting(LAST_STUDY_DATE_KEY, ''),
                    getDailyProgressMap()
                ]);
                const storedStreak = toNonNegativeInteger(raw);
                const totalStudyDays = Object.values(progress ?? {}).filter(count => toNonNegativeInteger(count) > 0).length;
                const bestStreak = Math.max(storedStreak, getBestStreak(progress));
                const lastDate = lastRaw ? new Date(lastRaw) : null;
                const today = new Date(); today.setHours(0,0,0,0);
                const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
                if (!lastDate || Number.isNaN(lastDate.getTime())) {
                    return { ...DEFAULT_STREAK_INFO, bestStreak, totalStudyDays };
                }
                const last = new Date(lastDate); last.setHours(0,0,0,0);
                if (+last === +today) return { streak: storedStreak, bestStreak, totalStudyDays, lastDate: lastRaw, studiedToday: true };
                if (+last === +yesterday) return { streak: storedStreak, bestStreak, totalStudyDays, lastDate: lastRaw, studiedToday: false };
                return { streak: 0, bestStreak, totalStudyDays, lastDate: lastRaw, studiedToday: false };
            } catch (e) { return { ...DEFAULT_STREAK_INFO }; }
        }

        async function recordStudyActivity() {
            const today = new Date().toISOString().slice(0, 10);
            const { streak, studiedToday } = await getStudyStreak();
            if (!studiedToday) {
                const newStreak = streak + 1;
                await db.setSetting(STREAK_KEY, String(newStreak));
                await db.setSetting(LAST_STUDY_DATE_KEY, today);
            }
            // Daily progress
            const progress = await getDailyProgressMap();
            progress[today] = (progress[today] || 0) + 1;
            await db.setSetting(DAILY_PROGRESS_KEY, JSON.stringify(progress));
        }

        async function getDailyGoal() {
            try {
                const raw = await db.getSetting(DAILY_GOAL_KEY, '20');
                return Math.max(1, toNonNegativeInteger(raw, 20));
            } catch (e) {
                return 20;
            }
        }

        async function setDailyGoal(goal) {
            await db.setSetting(DAILY_GOAL_KEY, String(goal));
        }

        async function getDailyProgress() {
            const today = new Date().toISOString().slice(0, 10);
            const progress = await getDailyProgressMap();
            return toNonNegativeInteger(progress?.[today]);
        }

        async function getWeeklyProgress() {
            const progress = await getDailyProgressMap();
            const result = [];
            for (let i = 6; i >= 0; i--) {
                const d = new Date(); d.setDate(d.getDate() - i);
                const key = d.toISOString().slice(0, 10);
                result.push({ date: key, count: toNonNegativeInteger(progress?.[key]), day: d.toLocaleDateString('en-US', { weekday: 'long' }) });
            }
            return result;
        }

        async function generateSmartRevision() {
            const [questions, perf, bmIds, hyIds] = await Promise.all([
                db.getAllQuestions(), db.getPerformance(),
                db.getAllBookmarkedIds(), db.getAllHighYieldIds()
            ]);
            const latest = {};
            perf.forEach(x => {
                if (!latest[x.questionId] || new Date(x.timestamp) > new Date(latest[x.questionId].timestamp)) {
                    latest[x.questionId] = { correct: x.correct, timestamp: x.timestamp };
                }
            });
            const wrongIds = Object.keys(latest).filter(k => latest[k].correct === false).map(Number);
            const missed = questions.filter(q => wrongIds.includes(q.id));
            const highYield = questions.filter(q => hyIds.includes(q.id));
            const bookmarked = questions.filter(q => bmIds.includes(q.id));

            const pool = [];
            // Priority: missed > high yield > bookmarked > random
            missed.forEach(q => pool.push({ q, weight: 10 }));
            highYield.forEach(q => { if (!pool.find(p => p.q.id === q.id)) pool.push({ q, weight: 5 }); });
            bookmarked.forEach(q => { if (!pool.find(p => p.q.id === q.id)) pool.push({ q, weight: 3 }); });

            // Fill up to 20 with random weak-topic questions if pool is small
            if (pool.length < 20) {
                const weakTopics = {};
                perf.filter(x => !x.correct).forEach(x => {
                    const key = x.subject || 'Unknown';
                    weakTopics[key] = (weakTopics[key] || 0) + 1;
                });
                const weakSubjects = Object.entries(weakTopics).sort((a, b) => b[1] - a[1]).map(([k]) => k);
                const candidates = questions.filter(q => weakSubjects.includes(q.subject) && !pool.find(p => p.q.id === q.id));
                candidates.sort(() => Math.random() - 0.5).slice(0, 20 - pool.length).forEach(q => pool.push({ q, weight: 2 }));
            }

            // Shuffle weighted pool
            const weighted = [];
            pool.forEach(p => { for (let i = 0; i < p.weight; i++) weighted.push(p.q); });
            const selected = [];
            const seen = new Set();
            while (selected.length < Math.min(20, weighted.length) && seen.size < weighted.length) {
                const q = weighted[Math.floor(Math.random() * weighted.length)];
                if (!seen.has(q.id)) { seen.add(q.id); selected.push(q); }
            }
            return selected;
        }

        async function startAdaptiveExam() {
            const questions = await db.getAllQuestions();
            if (questions.length === 0) { showToast('No questions available.', 'warning'); return; }
            const perf = await db.getPerformance();
            const latest = {};
            perf.forEach(x => {
                if (!latest[x.questionId] || new Date(x.timestamp) > new Date(latest[x.questionId].timestamp)) {
                    latest[x.questionId] = x;
                }
            });
            // Score each question: lower accuracy = higher priority
            const scored = questions.map(q => {
                const rec = latest[q.id];
                let score = 0.5;
                if (rec) {
                    score = rec.correct ? 0.3 : 0.9;
                    if (q.difficulty === 'Hard') score += 0.1;
                    if (q.difficulty === 'Easy') score -= 0.1;
                }
                return { q, score: Math.max(0, Math.min(1, score)) };
            });
            scored.sort((a, b) => b.score - a.score);
            const selected = scored.slice(0, Math.min(20, scored.length)).map(s => s.q);
            AppState.examQuestions = selected;
            AppState.examAnswers = { currentIndex: 0 };
            AppState._examSaved = false;
            AppState.examInProgress = true;
            AppState.examShowResults = false;
            AppState.lastExamResults = null;
            AppState.examStartTime = Date.now();
            AppState.examTimeRemaining = 0;
            if (AppState.examTimer) { clearInterval(AppState.examTimer); AppState.examTimer = null; }
            renderViewSafely('exam');
        }

        async function startSmartRevision() {
            const selected = await generateSmartRevision();
            if (selected.length === 0) { showToast('No revision questions available. Start studying first!', 'warning'); return; }
            AppState.studyQuestions = selected;
            AppState.studyIndex = 0;
            AppState.studyAnswers = {};
            AppState.studyRevealed = {};
            navigateTo('study');
            setTimeout(() => renderStudyQuestion(), 100);
        }

        async function continueStudying() {
            if (AppState.studyQuestions && AppState.studyIndex < AppState.studyQuestions.length) {
                navigateTo('study');
                setTimeout(() => renderStudyQuestion(), 100);
            } else {
                showToast('No active study session. Start a new one!', 'info');
            }
        }

async function renderDashboard() {
            let streakInfo = { ...DEFAULT_STREAK_INFO };
            let dailyProgress = 0;
            let dailyGoal = 20;
            let weeklyProgress = [];
            const canContinue = Boolean(
                AppState.studyQuestions?.length &&
                (AppState.studyIndex ?? 0) < AppState.studyQuestions.length
            );

            // Parallel cached reads — no blocking sequential DB calls
            const [questions, bookmarks, history, perf, loadedStreakInfo, loadedDailyGoal, progressByDate] = await Promise.all([
                db.getAllQuestions(),
                db.getAllBookmarkedIds(),
                db.getExamHistory(),
                db.getPerformance(),
                getStudyStreak(),
                getDailyGoal(),
                getDailyProgressMap()
            ]);

            streakInfo = { ...DEFAULT_STREAK_INFO, ...(loadedStreakInfo ?? {}) };
            dailyGoal = Math.max(1, toNonNegativeInteger(loadedDailyGoal, 20));
            const today = new Date().toISOString().slice(0, 10);
            dailyProgress = toNonNegativeInteger(progressByDate?.[today]);
            weeklyProgress = Array.from({ length: 7 }, (_, index) => {
                const date = new Date();
                date.setUTCDate(date.getUTCDate() - (6 - index));
                const dateKey = date.toISOString().slice(0, 10);
                return {
                    day: date.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' }),
                    count: toNonNegativeInteger(progressByDate?.[dateKey])
                };
            });
            const dailyProgressPercent = Math.min(100, Math.round((dailyProgress / dailyGoal) * 100));

            const total = questions.length;
            const correct = perf.filter(x => x.correct).length;
            const wrong = perf.length - correct;
            const acc = perf.length ? Math.round(correct * 100 / perf.length) : 0;
            const avg = history.length ? Math.round(history.reduce((s, e) => s + (e.percentage || 0), 0) / history.length) : 0;

            // Render skeleton immediately
            let html = `
            <div class="card"><div class="card-header">📊 Dashboard</div>
              <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:10px;">
                <div class="stat-card"><div class="stat-value">${total}</div><div class="stat-label">Questions</div></div>
                <div class="stat-card"><div class="stat-value">${bookmarks.length}</div><div class="stat-label">Bookmarked</div></div>
                <div class="stat-card"><div class="stat-value">${history.length}</div><div class="stat-label">Exams</div></div>
                <div class="stat-card"><div class="stat-value">${correct}</div><div class="stat-label">Correct</div></div>
                <div class="stat-card"><div class="stat-value">${wrong}</div><div class="stat-label">Wrong</div></div>
                <div class="stat-card"><div class="stat-value">${acc}%</div><div class="stat-label">Accuracy</div></div>
                <div class="stat-card"><div class="stat-value">${avg}%</div><div class="stat-label">Avg Accuracy</div></div>
              </div>
            </div>
            <div class="card"><div class="card-header">🔥 Study Streak & Daily Goal</div>
              <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:10px;margin-bottom:10px;">
                <div class="stat-card"><div class="stat-value">${streakInfo?.streak ?? 0}</div><div class="stat-label">Current Streak</div></div>
                <div class="stat-card"><div class="stat-value">${streakInfo?.bestStreak ?? 0}</div><div class="stat-label">Best Streak</div></div>
                <div class="stat-card"><div class="stat-value">${streakInfo?.totalStudyDays ?? 0}</div><div class="stat-label">Total Study Days</div></div>
                <div class="stat-card"><div class="stat-value">${dailyProgress}</div><div class="stat-label">Today</div></div>
                <div class="stat-card"><div class="stat-value">${dailyGoal}</div><div class="stat-label">Daily Goal</div></div>
                <div class="stat-card"><div class="stat-value">${dailyProgressPercent}%</div><div class="stat-label">Progress</div></div>
              </div>
              <div style="margin-bottom:10px;">
                <div class="progress-bar"><div class="progress-fill" style="width:${dailyProgressPercent}%"></div></div>
              </div>
              <div style="display:flex;gap:8px;flex-wrap:wrap;">
                <button class="btn btn-sm btn-primary" id="btnSetDailyGoal">🎯 Set Daily Goal</button>
                <button class="btn btn-sm btn-success" id="btnContinueStudy" ${canContinue ? '' : 'disabled'}>▶️ Continue Studying</button>
                <button class="btn btn-sm btn-accent" id="btnSmartRevision">🧠 Smart Revision</button>
                <button class="btn btn-sm btn-warning" id="btnAdaptiveQuiz">🎯 Adaptive Quiz</button>
              </div>
            </div>

            <div class="card"><div class="card-header">📅 Weekly Activity</div>
              <div style="display:flex;gap:6px;align-items:flex-end;justify-content:space-between;height:80px;padding:10px 0;">
                ${weeklyProgress.map(d => `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;">
                  <div style="width:100%;background:linear-gradient(180deg,var(--primary),var(--accent));border-radius:4px;opacity:0.8;transition:height 0.3s;height:${Math.min(60, (d.count / Math.max(dailyGoal, 1)) * 60)}px;"></div>
                  <div style="font-size:clamp(0.45rem,1.7vw,0.65rem);color:var(--text-muted);font-weight:600;white-space:nowrap;">${d.day}</div>
                  <div style="font-size:0.6rem;color:var(--text2);">${d.count}</div>
                </div>`).join('')}
              </div>
            </div>

            <div class="card"><div class="card-header">📚 By Subject</div>
              <div id="dashboardSubjects"><div class="empty-state">Loading subject breakdown...</div></div>
            </div>
            <div class="card"><div class="card-header">🎯 Weak Topics</div>
              <div id="dashboardWeakTopics"><div class="empty-state">Loading analytics...</div></div>
            </div>
            <div class="card">
              <div class="card-header">❌ Missed Questions Bank</div>
              <div style="font-size:13px">Review your incorrect answers in one place.</div>
              <div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap">
                <span class="badge badge-danger">${wrong} Missed</span>
                <button class="btn btn-sm btn-danger" data-nav="mistakes">Review Mistakes</button>
              </div>
            </div>
            <div class="card">
              <div class="card-header">⭐ High Yield Questions</div>
              <div style="font-size:13px">Mark important board and exam questions.</div>
              <div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap">
                <span class="badge badge-warning" id="hyBadge">${(await db.getAllHighYieldIds()).length} High Yield</span>
                <button class="btn btn-sm btn-accent" data-nav="highyield">Review High Yield</button>
              </div>
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;">
              <button class="btn btn-primary btn-sm" data-nav="study">📖 Study</button>
              <button class='btn btn-success btn-sm' id='btnAdaptiveStudy'>🧠 Adaptive Study</button>
              <button class='btn btn-accent btn-sm' onclick='startAdaptiveExam()'>🎯 Adaptive Exam</button>
              <button class="btn btn-accent btn-sm" data-nav="exam">📝 Exam</button>
            </div>
            <div class="card">
              <div class="card-header">📈 Subject Performance Analytics</div>
              <div id="subjectAnalyticsContainer">
                <small>Accuracy by Subject will be calculated automatically from performance history.</small>
              </div>
            </div>`;

            // LAZY LOAD: offload heavy analytics to Web Worker, then paint results
            LazyRenderer.schedule(async () => {
                try {
                    const analytics = await WorkerPool.post('analytics', {
                        questions, performance: perf, bookmarks, examHistory: history
                    });
                    // Subject breakdown
                    const subjectEntries = Object.entries(analytics.subjectCounts).sort((a, b) => b[1] - a[1]);
                    const subjHtml = subjectEntries.length
                        ? subjectEntries.map(([s,c])=>`<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--border);"><span>${escapeHTML(s)}</span><span class="badge badge-primary">${c}</span></div>`).join('')
                        : '<div class="empty-state">No questions yet.</div>';
                    const subjContainer = $('#dashboardSubjects');
                    if (subjContainer) subjContainer.innerHTML = subjHtml;

                    // Weak topics
                    const weakHtml = analytics.weakArr.length
                        ? analytics.weakArr.map(x=>`<div style="display:flex;justify-content:space-between;padding:6px 0"><span>${x.k}</span><span class="badge badge-danger">${x.p}%</span></div>`).join('')
                        : `<div class="empty-state">Solve more questions to generate weak-topic analytics.</div>`;
                    const weakContainer = $('#dashboardWeakTopics');
                    if (weakContainer) weakContainer.innerHTML = weakHtml;
                } catch (e) {
                    console.error('Dashboard analytics error:', e);
                }
            }, 'idle');

            return html;
        }

        async function renderStudy() {
            const sf = AppState.studyFilter;

            if (sf.mode === 'lectures') {
                return await renderLectureBrowser();
            }
            if (sf.mode === 'lectureReader' && sf.lectureId) {
                return await renderLectureReader(sf.lectureId);
            }

            const questions = await db.getAllQuestions();
            const books = await db.getAllBooks();
            let filtered = questions;
            if (sf.subject !== 'all') filtered = filtered.filter(q => (q.subject || 'Uncategorized') === sf.subject);
            if (sf.chapter !== 'all') filtered = filtered.filter(q => (q.chapter || 'General') === sf.chapter);
            if (sf.topic !== 'all') filtered = filtered.filter(q => (q.topic || 'General') === sf.topic);
            if (sf.subtopic !== 'all') filtered = filtered.filter(q => ((q.subtopic || 'General') === sf.subtopic));
            if (sf.book !== 'all') filtered = filtered.filter(q => (q.book || '') === sf.book);
            if (sf.mode === 'bookmarked') { const bIds = await db.getAllBookmarkedIds(); filtered = filtered.filter(q => bIds.includes(q.id)); }
            if (sf.mode === 'highyield') { const hyIds = await db.getAllHighYieldIds(); filtered = filtered.filter(q => hyIds.includes(q.id)); }

            const taxonomy = computeTaxonomy(questions);
            const subjectOpts = '<option value="all">All</option>' + taxonomy.subjects.map(s => `<option value="${escapeHTML(s)}" ${sf.subject===s?'selected':''}>${escapeHTML(s)}</option>`).join('');
            let chapterList = taxonomy.allChapters;
            if (sf.subject !== 'all' && taxonomy.chaptersBySubject[sf.subject]) chapterList = taxonomy.chaptersBySubject[sf.subject];
            const chapterOpts = '<option value="all">All</option>' + chapterList.map(c => `<option value="${escapeHTML(c)}" ${sf.chapter===c?'selected':''}>${escapeHTML(c)}</option>`).join('');

            const topicSet = new Set();
            filtered.forEach(q => { if (q.topic) topicSet.add(q.topic); });
            const topicOpts = '<option value="all">All</option>' + [...topicSet].sort().map(t => `<option value="${escapeHTML(t)}" ${sf.topic===t?'selected':''}>${escapeHTML(t)}</option>`).join('');
            const bookOpts = '<option value="all">All Books</option>' + books.map(g => `<option value="${escapeHTML(g)}" ${sf.book===g?'selected':''}>${escapeHTML(g)}</option>`).join('');

            const subtopicSet = new Set();
            filtered.forEach(q => { if (q.subtopic) subtopicSet.add(q.subtopic); });
            const subtopicOpts = '<option value="all">All</option>' + [...subtopicSet].sort().map(st => `<option value="${escapeHTML(st)}" ${sf.subtopic===st?'selected':''}>${escapeHTML(st)}</option>`).join('');

            return `
            <div class="card">
              <div class="card-header">📖 Study Mode</div>
              <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;">
                <button class="btn btn-sm ${sf.mode==='practice'?'btn-primary':'btn-outline'}" data-study-mode="practice">Practice</button>
                <button class="btn btn-sm ${sf.mode==='bookmarked'?'btn-primary':'btn-outline'}" data-study-mode="bookmarked">⭐ Bookmarked</button>
                <button class="btn btn-sm ${sf.mode==='highyield'?'btn-primary':'btn-outline'}" data-study-mode="highyield">🔥 High Yield</button>
                <button class="btn btn-sm ${sf.mode==='lectures'?'btn-primary':'btn-outline'}" data-study-mode="lectures">📚 Lectures</button>
              </div>
              <div class="form-row">
                <div><label>Subject</label><select id="studySubject">${subjectOpts}</select></div>
                <div><label>Chapter</label><select id="studyChapter">${chapterOpts}</select></div>
                <div><label>Topic</label><select id="studyTopic">${topicOpts}</select></div>
                <div><label>Subtopic</label><select id="studySubtopic">${subtopicOpts}</select></div>
                <div><label>Book</label><select id="studyBook">${bookOpts}</select></div>
              </div>
              <p style="font-size:0.85rem;color:var(--text2);">${filtered.length} questions match</p>
              <button class="btn btn-primary btn-block" id="btnStartStudy">▶️ Start Studying</button>
            </div>
            <div id="studyArea"></div>`;
        }

        async function renderLectureBrowser() {
            const lectures = await db.getAllLectures();
            const sf = AppState.studyFilter;
            let filtered = lectures;
            if (sf.subject !== 'all') filtered = filtered.filter(l => (l.subject || '') === sf.subject);
            if (sf.chapter !== 'all') filtered = filtered.filter(l => (l.chapter || '') === sf.chapter);

            const subjectOpts = '<option value="all">All</option>' + ALL_SUBJECTS.map(s => `<option value="${escapeHTML(s)}" ${sf.subject===s?'selected':''}>${escapeHTML(s)}</option>`).join('');

            // Chapter options: only chapters that actually have lectures, scoped to the
            // current subject filter so the list stays short and relevant.
            const chapterSource = sf.subject !== 'all' ? lectures.filter(l => (l.subject || '') === sf.subject) : lectures;
            const chapterSet = new Set();
            chapterSource.forEach(l => { if (l.chapter) chapterSet.add(l.chapter); });
            const chapterOpts = '<option value="all">All Chapters</option>' + [...chapterSet].sort().map(c => `<option value="${escapeHTML(c)}" ${sf.chapter===c?'selected':''}>${escapeHTML(c)}</option>`).join('');

            return `
            <div class="card">
              <div class="card-header">📚 Lectures</div>
              <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;">
                <button class="btn btn-sm btn-outline" data-study-mode="practice">← Back to Study</button>
                ${RBAC.isAdmin() ? `<button class="btn btn-sm btn-primary" id="btnAddLecture">➕ Add Lecture</button>` : ''}
              </div>
              <div class="form-row">
                <div><label>Subject</label><select id="lectureSubjectFilter">${subjectOpts}</select></div>
                <div><label>Chapter</label><select id="lectureChapterFilter">${chapterOpts}</select></div>
              </div>
              <p style="font-size:0.85rem;color:var(--text2);">${filtered.length} lectures</p>
            </div>
            ${filtered.length === 0 ? '<div class="empty-state">No lectures yet. Add your first lecture above.</div>' :
              filtered.map(l => `
                <div class="card lecture-card" data-lid="${l.id}" style="cursor:pointer;">
                  <div style="display:flex;justify-content:space-between;align-items:flex-start;">
                    <div>
                      <div style="font-weight:700;font-size:1.05rem;margin-bottom:6px;">${escapeHTML(l.title || 'Untitled')}</div>
                      <div class="flex-wrap">
                        <span class="badge badge-primary">${escapeHTML(l.subject || 'Unknown')}</span>
                        <span class="badge badge-accent">${escapeHTML(l.chapter || 'General')}</span>
                        ${l.book ? `<span class="badge badge-group">${escapeHTML(l.book)}</span>` : ''}
                      </div>
                    </div>
                    <button class="btn btn-sm btn-outline lecture-exam-btn" data-lid="${l.id}" style="white-space:nowrap;">📝 Exam</button>
                  </div>
                  <div style="margin-top:10px;font-size:0.82rem;color:var(--text2);line-height:1.5;max-height:60px;overflow:hidden;position:relative;">
                    ${escapeHTML((l.content || '').substring(0, 180))}${(l.content || '').length > 180 ? '…' : ''}
                  </div>
                </div>
              `).join('')}`;
        }

        async function renderLectureReader(lectureId) {
            const l = await db.getLecture(lectureId);
            if (!l) return '<div class="card text-center"><h3>Lecture not found</h3><button class="btn btn-outline" data-study-mode="lectures">← Back</button></div>';
            const allQuestions = await db.getAllQuestions();
            const attachedCount = allQuestions.filter(q => q.lectureId === l.id).length;
            const chapterCount = allQuestions.filter(q => (q.subject||'') === (l.subject||'') && (q.chapter||'') === (l.chapter||'')).length;
            return `
            <div class="card">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:10px;">
                <div>
                  <div class="card-header" style="margin-bottom:4px;">${escapeHTML(l.title || 'Untitled')}</div>
                  <div class="flex-wrap">
                    <span class="badge badge-primary">${escapeHTML(l.subject || 'Unknown')}</span>
                    <span class="badge badge-accent">${escapeHTML(l.chapter || 'General')}</span>
                    ${l.book ? `<span class="badge badge-group">${escapeHTML(l.book)}</span>` : ''}
                    ${l.page ? `<span class="badge badge-warning">📄 Page ${escapeHTML(String(l.page))}</span>` : ''}
                  </div>
                </div>
                <div style="display:flex;gap:8px;flex-wrap:wrap;">
                  <button class="btn btn-sm btn-outline" data-study-mode="lectures">← Back</button>
                  ${RBAC.isAdmin() ? `<button class="btn btn-sm btn-danger" id="btnDeleteLecture" data-lid="${l.id}">🗑 Delete</button>` : ''}
                </div>
              </div>
            </div>
            <div class="card" style="line-height:1.8;font-size:0.95rem;white-space:pre-wrap;">${escapeHTML(l.content || 'No content.')}</div>
            <div class="card">
              <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;">
                <button class="btn btn-accent" id="btnExamLectureAttached" data-lid="${l.id}">📝 Exam: This Lecture's MCQs (${attachedCount})</button>
                <button class="btn btn-primary" id="btnExamChapterAllBooks" data-subj="${escapeHTML(l.subject||'')}" data-chap="${escapeHTML(l.chapter||'')}">📚 Exam: All MCQs, This Chapter (${chapterCount})</button>
              </div>
            </div>`;
        }

        async function renderExamSetup() {
            const books = await db.getAllBooks();
            const taxonomy = computeTaxonomy(await db.getAllQuestions());
            return `
            <div class="card">
              <div class="card-header">📝 Exam Setup</div>
              <div style="margin-bottom:12px">
                <label>📂 Book</label>
                <select id="examBook">
                  <option value="all">All Books</option>
                  ${books.map(g=>`<option value="${escapeHTML(g)}">${escapeHTML(g)}</option>`).join('')}
                </select>
              </div>
              <div style="margin-bottom:12px">
                <label>📚 Subject</label>
                <select id="examSubject">
                  <option value="all">All Subjects</option>
                  ${taxonomy.subjects.map(s=>`<option value="${escapeHTML(s)}">${escapeHTML(s)}</option>`).join('')}
                </select>
              </div>
              <div style="margin-bottom:12px">
                <label>📖 Chapter</label>
                <select id="examChapter">
                  <option value="all">All Chapters</option>
                  ${taxonomy.allChapters.map(c=>`<option value="${escapeHTML(c)}">${escapeHTML(c)}</option>`).join('')}
                </select>
              </div>
              <div class="form-row">
                <div><label>Questions</label><select id="examCount"><option>10</option><option selected>20</option><option>30</option><option>50</option></select></div>
                <div><label>Timer</label><select id="examTimerMinutes"><option value="0">None</option><option selected value="30">30</option><option value="60">60</option></select></div>
                <div><label>Difficulty</label><select id="examDifficulty"><option value="all">All</option><option>Easy</option><option>Medium</option><option>Hard</option></select></div>
              </div>
              <button class="btn btn-accent btn-block mt-2" id="btnStartExam">🚀 Start Exam</button>
            </div>`;
        }

        async function renderExamInProgress() {
            const idx = AppState.examAnswers.currentIndex || 0;
            const total = AppState.examQuestions.length;
            const q = AppState.examQuestions[idx];
            if (!q) { AppState.examInProgress = false; return renderExamResults(); }
            const sel = AppState.examAnswers[q.id] || '';
            const timerHtml = AppState.examTimeRemaining > 0 ? `<div class="timer-display" id="examTimerDisplay">${formatTime(AppState.examTimeRemaining)}</div>` : '';
            const bmIds=await db.getAllBookmarkedIds();
            const bmCount=bmIds.length;
            const isBm=bmIds.includes(q.id);
            return `
            <div class="card">
              <div style="display:flex;justify-content:space-between;"><span class="badge badge-primary">Q ${idx+1}/${total}</span><span class="badge badge-accent">⭐ ${bmCount}</span>${timerHtml}</div>
              <div class="progress-bar"><div class="progress-fill" style="width:${((idx+1)/total)*100}%"></div></div>
            </div>
            <div class="question-block">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;"><div class="question-text" style="flex:1;">${idx+1}. ${escapeHTML(q.questionText)}</div><button class="btn btn-sm btn-outline bookmark-btn" data-qid="${q.id}" title="Bookmark">${isBm?"⭐":"☆"}</button></div>
              ${QuestionImages.render(q, 'question')}
              ${['A','B','C','D','E'].map(l=> q[`option${l}`] ? `<button class="option-btn ${sel===l?'selected':''}" data-option="${l}" aria-pressed="${sel===l}"><span class="option-label">${l}.</span> <span class="option-content" dir="auto">${escapeHTML(q[`option${l}`])}</span></button>` : '').join('')}
              ${renderQuestionBookLocation(q)}
            </div>
            <div class="exam-actions">
              <button class="btn btn-outline btn-sm" id="btnPrevQ" ${idx===0?'disabled':''}>◀ Prev</button>
              <button class="btn btn-danger btn-sm" id="btnEndExam">⏹ End</button>
              <button class="btn btn-primary btn-sm" id="btnNextQ">${idx<total-1?'Next ▶':'Submit ✅'}</button>
            </div>`;
        }

        function renderExamResults() {
            const results = AppState.lastExamResults || [];
            const total = results.length;
            const score = results.filter(r => r.correct).length;
            const pct = total ? Math.round((score / total) * 100) : 0;
            const elapsed = AppState.examStartTime ? Math.round((Date.now() - AppState.examStartTime) / 1000) : 0;
            if (total && !AppState._examSaved) {
                AppState._examSaved = true;
                db.saveExamResult({ score, total, percentage: pct, elapsed });
            }
            return `
            <div class="card text-center" style="padding-top: 30px; padding-bottom: 30px;">
              <div style="font-size:4rem; margin-bottom: 10px;">${pct>=70?'🎉':'📚'}</div>
              <h2>Exam Complete</h2>
              <div class="stat-value" style="font-size: 3rem; margin: 15px 0;">${pct}%</div>
              <p style="font-size: 1.1rem; color: var(--text2); margin-bottom: 25px;">${score} out of ${total} correct<br>Time taken: ${formatTime(elapsed)}</p>
              <button class="btn btn-primary btn-block" id="btnReviewExam" style="margin-bottom: 10px; font-size: 1.1rem; padding: 14px;">🔍 Review Answers & Explanations</button>
              <button class="btn btn-outline btn-block" data-nav="dashboard">🏠 Go to Dashboard</button>
            </div>`;
        }

        // --- FULLY REDESIGNED REVIEW SYSTEM ---
        function reviewExamResults() {
            if (!AppState.lastExamResults) return;
            const html = AppState.lastExamResults.map((r, i) => {
                const optionsHtml = ['A','B','C','D','E'].map(l => {
                    if (!r[`option${l}`]) return '';
                    let btnClass = '';
                    let labelStatus = '';
                    if (l === r.correctAnswer) {
                        btnClass = 'correct';
                        labelStatus = '<span style="float:right; font-weight:bold;">✅ Correct Answer</span>';
                    } else if (l === r.userAnswer && !r.correct) {
                        btnClass = 'wrong';
                        labelStatus = '<span style="float:right; font-weight:bold;">❌ Your Answer</span>';
                    }
                    return `<div class="option-btn ${btnClass}" style="cursor:default;">
                                <span class="option-label">${l}.</span> <span class="option-content" dir="auto">${escapeHTML(r[`option${l}`])}</span>
                                ${labelStatus}
                            </div>`;
                }).join('');
                const explanationHtml = r.explanation ?
                    `<div class="explanation-box" style="margin-top: 15px;">
                        <strong>Explanation:</strong><br/>${escapeHTML(r.explanation)}
                    </div>` : '';
                return `
                <div class="question-block">
                    <div class="question-text">
                        ${i+1}. ${escapeHTML(r.questionText)}
                        <span class="badge ${r.correct ? 'badge-success' : 'badge-danger'}" style="margin-left: 8px;">
                            ${r.correct ? '✓ Correct' : '✗ Incorrect'}
                        </span>
                    </div>
                    ${QuestionImages.render(r, 'question')}
                    ${optionsHtml}
                    ${explanationHtml}
                    ${QuestionImages.render(r, 'explanation')}
                    ${renderQuestionReference(r)}
                </div>`;
            }).join('');
            $('#mainContent').innerHTML = `
                <div class="card">
                    <div class="card-header">🔍 Exam Review</div>
                    <p style="color:var(--text2);font-size:0.9rem;">Review your performance below. Correct answers are highlighted in green, and your incorrect selections are highlighted in red.</p>
                </div>
                ${html}
                <div style="margin-bottom: 30px;">
                    <button class="btn btn-primary btn-block" data-nav="exam">📝 Start New Exam</button>
                </div>
            `;
            attachEventListeners();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        /**
         * QUESTION LIST — Optimized path:
         * 1. Ensures search index is built (fast in-memory lookup).
         * 2. Uses FilterCache keyed by filter hash + DB cache version.
         * 3. Falls back to Web Worker for heavy filtering if available.
         * 4. Renders a virtual-scroll container instead of inline HTML for
         *    all questions, supporting 100k+ items with only ~15 DOM nodes.
         * 5. Infinite scroll loads 50 items at a time; smart loader prevents
         *    duplicate fetches and resets correctly on filter change.
         */
        async function renderQuestionList() {
            const questions = await db.getAllQuestions();
            await GlobalSearchIndex.ensureBuilt();

            const qf = AppState.questionFilters || {subject:'all',chapter:'all',topic:'all',difficulty:'all', special:'all'};
            const sq = AppState.searchQuery.toLowerCase().trim();

            // Fetch bookmark/high-yield/missed IDs in parallel
            const [bmIds, hyIds, perf2] = await Promise.all([
                db.getAllBookmarkedIds(),
                db.getAllHighYieldIds(),
                db.getPerformance()
            ]);
            const latest2={}; perf2.forEach(x=>latest2[x.questionId]=x.correct);
            const missedIds=Object.keys(latest2).filter(k=>latest2[k]===false).map(Number);

            // Store for event listener attachment
            window.__bmIds=bmIds;
            window.__hyIds=hyIds;
            window.__missedIds=missedIds;

            // FILTER CACHE: try cache first, then worker, then fallback
            let filtered = FilterCache.get(qf, sq, db._cacheVersion, () => {
                let result = questions;
                // Use search index for instant text search
                if (sq) {
                    const indexedIds = GlobalSearchIndex.search(sq);
                    if (indexedIds) {
                        result = result.filter(q => indexedIds.has(q.id));
                    } else {
                        result = result.filter(q => {
                            const text = [q.questionText, q.explanation, q.subject, q.chapter, q.topic, Array.isArray(q.tags) ? q.tags.join(' ') : q.tags].join(' ').toLowerCase();
                            return text.includes(sq);
                        });
                    }
                }
                if (qf.subject !== 'all') result = result.filter(q => (q.subject||'')===qf.subject);
                if (qf.chapter !== 'all') result = result.filter(q => (q.chapter||'')===qf.chapter);
                if (qf.topic !== 'all') result = result.filter(q => (q.topic||'')===qf.topic);
                if (qf.difficulty !== 'all') result = result.filter(q => (q.difficulty||'Medium')===qf.difficulty);
                const special = qf.special || 'all';
                if (special==='bookmarked') result = result.filter(q => bmIds.includes(q.id));
                if (special==='highyield') result = result.filter(q => hyIds.includes(q.id));
                if (special==='missed') result = result.filter(q => missedIds.includes(q.id));
                return result;
            });

            // Also try worker filtering asynchronously for next render (warm cache)
            WorkerPool.post('filter', { questions, filters: qf, searchQuery: sq, bmIds, hyIds, missedIds }).then(workerResult => {
                if (workerResult && Array.isArray(workerResult)) {
                    FilterCache._store.set(JSON.stringify({ f: qf, q: sq }), workerResult);
                }
            }).catch(() => {});

            // Persist for virtual scroller initialization in attachEventListeners
            AppState._lastFilteredQuestions = filtered;
            AppState._lastFilterMeta = { bmIds, hyIds, missedIds };

            // Topic filter options from full question set (not filtered)
            const topicsSet = new Set();
            questions.forEach(q => { if (q.topic) topicsSet.add(q.topic); });
            const topicOpts = '<option value="all">All</option>' + [...topicsSet].sort().map(t => `<option value="${escapeHTML(t)}">${escapeHTML(t)}</option>`).join('');

            return `
            <div class="card">
              <div class="card-header">📋 Questions (${filtered.length})</div>
              <input type="text" id="questionSearchInput" placeholder="Search question, explanation, subject, chapter, topic, tags..." value="${escapeHTML(AppState.searchQuery)}">
              <div class="form-row">
                <div><select id="questionSubjectFilter"><option value="all">All Subjects</option></select></div>
                <div><select id="questionChapterFilter"><option value="all">All Chapters</option></select></div>
                <div><select id="questionTopicFilter">${topicOpts}</select></div>
              </div>
              <div class="form-row">
                <div><select id="questionDifficultyFilter"><option value="all">All Difficulties</option><option>Easy</option><option>Medium</option><option>Hard</option></select></div>
              </div>
              <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px">
                <button class="btn btn-sm btn-outline" data-qfilter="all">All</button>
                <button class="btn btn-sm btn-outline" data-qfilter="bookmarked">⭐ Bookmarked</button>
                <button class="btn btn-sm btn-outline" data-qfilter="highyield">🔥 High Yield</button>
                <button class="btn btn-sm btn-outline" data-qfilter="missed">❌ Missed</button>
              </div>
              ${RBAC.isAdmin() ? `<button class="btn btn-sm btn-primary" id="btnAddQuestion">➕ Add</button>` : ''}
            </div>
            <!-- Virtual Scroll Container -->
            <div id="questionListContainer" style="max-height:75vh;overflow:auto;position:relative;border-radius:12px;">
              <div id="questionListContent"></div>
            </div>
            <div id="questionListLoader" style="text-align:center;padding:14px;color:var(--text2);font-size:0.85rem;display:none;">Loading more...</div>
            ${filtered.length>50?'<p style="color:var(--text2);padding:8px;">Showing items dynamically. Scroll to load more.</p>':''}
            ${filtered.length===0?'<div class="empty-state"><h3>No questions found</h3><p>Open Account to download your question bank.</p></div>':''}`;
        }

        /**
         * Render a single question block for the virtual scroller.
         * Kept as a pure function so it can be called thousands of times
         * without closure leaks.
         */
        function renderQuestionBlock(q, index, meta) {
            const { bmIds } = meta || {};
            const isBm = bmIds ? bmIds.includes(q.id) : false;
            return `
            <div class="question-block" data-qid="${q.id}">
              <div style="display:flex;justify-content:space-between;">
                <strong>${highlightText(q.questionText?.substring(0,100), AppState.searchQuery)}</strong>
                <button class="btn-icon btn-sm bookmark-btn" data-qid="${q.id}">${isBm?'⭐':'☆'}</button>
              </div>
              <div class="flex-wrap">
                <span class="badge badge-primary">${escapeHTML(q.subject||'?')}</span>
                <span class="badge badge-accent">${escapeHTML(q.chapter||'?')}</span>
                ${q.group ? `<span class="badge badge-group">${escapeHTML(q.group)}</span>` : ''}
              </div>
              <button class="btn btn-sm btn-outline view-q-btn" data-qid="${q.id}">👁 View</button>
            </div>`;
        }

        async function renderMistakes() {
            const perf = await db.getPerformance();
            const latest = {};
            perf.forEach(x => {
                const key = x.questionId;
                if (!latest[key] || new Date(x.timestamp) > new Date(latest[key].timestamp)) {
                    latest[key] = { correct: x.correct, timestamp: x.timestamp };
                }
            });
            const wrongIds = Object.keys(latest)
                .filter(id => latest[id].correct === false)
                .map(id => Number(id));
            const questions = await db.getAllQuestions();
            const missed = questions.filter(q => wrongIds.includes(q.id));

            return `
            <div class="card">
              <div class="card-header">❌ Missed Questions Bank</div>
              <p>${missed.length} missed questions</p>
              <div style="display:flex;gap:8px;flex-wrap:wrap">
              <button class="btn btn-danger" id="btnExamFromMistakes">📝 Exam From Mistakes</button>
              <button class="btn btn-outline" data-nav="dashboard">← Dashboard</button>
              </div>
            </div>
            ${missed.map(q=>`
              <div class="question-block">
                <div class="question-text">${escapeHTML(q.questionText || '')}</div>
                ${QuestionImages.render(q, 'question')}
                <span class="badge badge-danger">${escapeHTML(q.subject || 'Unknown')}</span>
                 <div style="margin-top:8px"><strong>Correct Answer:</strong> ${q.correctAnswer||'-'}</div>
                 <div style="margin-top:4px"><strong>Explanation:</strong> ${escapeHTML(q.explanation||'No explanation')}</div>
                 ${QuestionImages.render(q, 'explanation')}
                 ${renderQuestionReference(q)}
                 <div style="margin-top:8px;display:flex;gap:8px">
                    <button class="btn btn-sm btn-primary retry-question" data-qid="${q.id}">🔄 Retry</button>
                    <button class="btn btn-sm btn-accent add-hy" data-qid="${q.id}">⭐ High Yield</button>
                 </div>
              </div>
            `).join('') || '<div class="empty-state">No missed questions.</div>'}`;
        }

        async function renderHighYield() {
            const hyIds = await db.getAllHighYieldIds();
            const allQuestions = await db.getAllQuestions();
            const hyQuestions = allQuestions.filter(q => hyIds.includes(q.id));

            return `
            <div class="card">
              <div class="card-header">⭐ High Yield Questions</div>
              <p>${hyQuestions.length} high‑yield questions</p>
              <div style="display:flex;gap:8px;flex-wrap:wrap">
                <button class="btn btn-outline" data-nav="dashboard">← Dashboard</button>
              </div>
            </div>
            ${hyQuestions.length === 0 ? '<div class="empty-state">No high‑yield questions marked yet.</div>' :
              hyQuestions.map(q => `
                <div class="question-block">
                  <div class="question-text">${escapeHTML(q.questionText)}</div>
                  <div class="flex-wrap">
                    <span class="badge badge-primary">${escapeHTML(q.subject || '?')}</span>
                    <span class="badge badge-accent">${escapeHTML(q.chapter || '?')}</span>
                  </div>
                  <div style="margin-top:8px;display:flex;gap:8px">
                    <button class="btn btn-sm btn-danger remove-hy" data-qid="${q.id}">⭐ Remove High Yield</button>
                    <button class="btn btn-sm btn-outline view-q-btn" data-qid="${q.id}">👁 View</button>
                  </div>
                </div>
              `).join('')}
            `;
        }

        async function renderStudyQuestion() {
            if (!window.ENTSubscription.canAccess()) return renderViewSafely('account');
            if (!AppState.studyQuestions || AppState.studyIndex >= AppState.studyQuestions.length) {
                $('#studyArea').innerHTML = '<div class="card text-center"><h3>Session Complete!</h3><button class="btn btn-primary" data-nav="study">New Session</button></div>';
                saveSession();
                return;
            }
            const q = AppState.studyQuestions[AppState.studyIndex];
            const isBm = await db.isBookmarked(q.id);
            const reveal = AppState.studyRevealed[q.id];
            let html = `
            <div class="card">
              <div style="display:flex;justify-content:space-between;"><span class="badge badge-primary">${AppState.studyIndex+1}/${AppState.studyQuestions.length}</span><button class="btn-icon btn-sm" id="studyBookmark" aria-label="Toggle bookmark" data-qid="${q.id}">${isBm?'⭐':'☆'}</button><button class="btn-icon btn-sm" id="studyHighYield" aria-label="Toggle high yield" data-qid="${q.id}">🔥</button></div>
              <div class="progress-bar"><div class="progress-fill" style="width:${((AppState.studyIndex+1)/AppState.studyQuestions.length)*100}%"></div></div>
            </div>
            <div class="question-block">
              <div class="question-text">${AppState.studyIndex+1}. ${escapeHTML(q.questionText)}</div>
              ${QuestionImages.render(q, 'question')}
              ${['A','B','C','D','E'].map(l=> q[`option${l}`] ? `<button class="option-btn ${AppState.studyAnswers[q.id]===l?'selected':''} ${reveal?(l===q.correctAnswer?'correct':(AppState.studyAnswers[q.id]===l?'wrong':'')):''}" data-study-opt="${l}" ${reveal?'disabled':''}><span class="option-label">${l}.</span> <span class="option-content" dir="auto">${escapeHTML(q[`option${l}`])}</span></button>` : '').join('')}
              ${reveal ? `<div class="explanation-box"><strong>✅ ${q.correctAnswer}</strong>: ${escapeHTML(q.explanation||'No explanation provided.')}</div>` : ''}
              ${reveal ? renderQuestionReference(q) : ''}
              ${reveal ? QuestionImages.render(q, 'explanation') : ''}
              ${renderQuestionBookLocation(q)}
            </div>
            <div class="study-actions">
              <button class="btn btn-outline btn-sm" id="btnStudyPrev" aria-label="Previous question" ${AppState.studyIndex===0?'disabled':''}>◀</button>
              ${!reveal?`<button class="btn btn-accent btn-sm" id="btnReveal">👁 Reveal</button>`:''}
              <button class="btn btn-primary btn-sm" id="btnStudyNext" aria-label="Next question">▶</button>
            </div>`;
            $('#studyArea').innerHTML = html;
            attachStudyListeners(q);
            saveSession();
        }

        function attachStudyListeners(q) {
            const bookmarkBtn = $('#studyBookmark');
            if (bookmarkBtn) {
                bookmarkBtn.addEventListener('click', async function() {
                    const id = parseInt(this.dataset.qid);
                    const bm = await db.toggleBookmark(id);
                    this.textContent = bm ? '⭐' : '☆';
                    saveSession();
                });
            }
            const hyBtn = $('#studyHighYield');
            if (hyBtn) {
                hyBtn.addEventListener('click', async function() {
                    const id = parseInt(this.dataset.qid);
                    const isHy = await db.toggleHighYield(id);
                    this.textContent = isHy ? '🔥' : '☆';
                    showToast(isHy ? 'Added to High Yield' : 'Removed from High Yield', 'success');
                    saveSession();
                });
            }
            $$('[data-study-opt]').forEach(b => {
                b.addEventListener('click', async function() {
                    const selected = this.dataset.studyOpt;
                    AppState.studyAnswers[q.id] = selected;
                    AppState.studyRevealed[q.id] = true;
                    try {
                        await db.recordPerformance({
                            questionId: q.id,
                            subject: q.subject || 'Unknown',
                            chapter: q.chapter || 'Unknown',
                            topic: q.topic || 'Unknown',
                            correct: selected === q.correctAnswer,
                            timestamp: new Date().toISOString()
                        });
                        await recordStudyActivity();
                    } catch(e) {
                        console.error('Performance tracking error', e);
                    }
                    renderStudyQuestion();
                });
            });
            const revealBtn = $('#btnReveal');
            if (revealBtn) revealBtn.addEventListener('click', () => { AppState.studyRevealed[q.id] = true; renderStudyQuestion(); });
            const nextBtn = $('#btnStudyNext');
            if (nextBtn) nextBtn.addEventListener('click', () => { AppState.studyIndex++; renderStudyQuestion(); });
            const prevBtn = $('#btnStudyPrev');
            if (prevBtn) prevBtn.addEventListener('click', () => { AppState.studyIndex = Math.max(0, AppState.studyIndex - 1); renderStudyQuestion(); });
        }

        function submitExam() {
            if (AppState.examTimer) { clearInterval(AppState.examTimer); AppState.examTimer = null; }
            const answers = AppState.examAnswers;
            const questions = AppState.examQuestions;
            const results = questions.map(q => ({
                ...q,
                userAnswer: answers[q.id] || '',
                correct: (answers[q.id] || '') === q.correctAnswer
            }));
            AppState.lastExamResults = results;
            AppState.examInProgress = false;
            AppState.examShowResults = true;
            renderViewSafely('exam').then(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        // ============================================================
        //  MODALS
        // ============================================================
        function showQuestionModal(q) {
            window.__questionImageFormRequest = (window.__questionImageFormRequest || 0) + 1;
            const html = q ? `
            <h3>Question</h3>
            <div class="question-block">
              <div class="question-text">${escapeHTML(q.questionText)}</div>
              ${QuestionImages.render(q, 'question')}
              ${['A','B','C','D','E'].map(l=> q[`option${l}`]?`<div class="option-btn ${l===q.correctAnswer?'correct':''}"><span class="option-label">${l}.</span> <span class="option-content" dir="auto">${escapeHTML(q[`option${l}`])}</span></div>`:'').join('')}
              ${q.explanation ? `<div class="explanation-box">${escapeHTML(q.explanation)}</div>` : ''}
              ${QuestionImages.render(q, 'explanation')}
              ${renderQuestionReference(q)}
              <div class="flex-wrap" style="margin-top:10px;">
                <span class="badge badge-primary">${escapeHTML(q.subject||'')}</span>
                <span class="badge badge-accent">${escapeHTML(q.chapter||'')}</span>
                ${q.group ? `<span class="badge badge-group">${escapeHTML(q.group)}</span>` : ''}
              </div>
            </div>
            <button class="btn btn-outline btn-block" onclick="closeModal()">Close</button>` : '<h3>Question not found</h3><button class="btn btn-outline btn-block" onclick="closeModal()">Close</button>';
            const overlay = $('#modalOverlay'); const content = $('#modalContent');
            content.innerHTML = html; overlay.classList.remove('hidden');
            overlay.onclick = function(e) { if (e.target === overlay) closeModal(); };
        }

        async function startExamFromLecture(l) {
            let questions = await db.getAllQuestions();
            if (l.subject) questions = questions.filter(q => (q.subject || '') === l.subject);
            if (l.chapter) questions = questions.filter(q => (q.chapter || '') === l.chapter);
            if (l.book) questions = questions.filter(q => (q.book || '') === l.book);
            if (questions.length === 0) { showToast('No questions match this lecture.', 'warning'); return; }
            AppState.examQuestions = [...questions].sort(() => Math.random() - 0.5).slice(0, Math.min(20, questions.length));
            AppState.examAnswers = { currentIndex: 0 }; AppState._examSaved = false;
            AppState.examInProgress = true;
            AppState.examShowResults = false; AppState.lastExamResults = null;
            AppState.examTimeRemaining = 0; AppState.examStartTime = Date.now();
            renderViewSafely('exam');
        }

        async function startExamFromLectureAttached(lectureId) {
            const allQuestions = await db.getAllQuestions();
            const questions = allQuestions.filter(q => q.lectureId === lectureId);
            if (questions.length === 0) { showToast('No MCQs are attached to this lecture yet. Add them from "Add Lecture" with the MCQ JSON field.', 'warning'); return; }
            AppState.examQuestions = [...questions].sort(() => Math.random() - 0.5).slice(0, Math.min(20, questions.length));
            AppState.examAnswers = { currentIndex: 0 }; AppState._examSaved = false;
            AppState.examInProgress = true;
            AppState.examShowResults = false; AppState.lastExamResults = null;
            AppState.examTimeRemaining = 0; AppState.examStartTime = Date.now();
            renderViewSafely('exam');
        }

        async function startExamFromChapterAllBooks(l) {
            let questions = await db.getAllQuestions();
            if (l.subject) questions = questions.filter(q => (q.subject || '') === l.subject);
            if (l.chapter) questions = questions.filter(q => (q.chapter || '') === l.chapter);
            if (questions.length === 0) { showToast('No questions found for this chapter yet.', 'warning'); return; }
            AppState.examQuestions = [...questions].sort(() => Math.random() - 0.5).slice(0, Math.min(20, questions.length));
            AppState.examAnswers = { currentIndex: 0 }; AppState._examSaved = false;
            AppState.examInProgress = true;
            AppState.examShowResults = false; AppState.lastExamResults = null;
            AppState.examTimeRemaining = 0; AppState.examStartTime = Date.now();
            renderViewSafely('exam');
        }

        function attachEventListeners() {
            $$('[data-nav]').forEach(btn => { btn.addEventListener('click', function() { const view = this.dataset.nav; if (view) navigateTo(view); }); });

            // Exam subject/chapter
            const examSubject = $('#examSubject');
            if (examSubject) {
                examSubject.addEventListener('change', function() {
                    const subject = this.value; let chapters = [];
                    if (subject !== 'all' && ENT_DATA[subject]) chapters = ENT_DATA[subject];
                    const chSel = $('#examChapter');
                    if (chSel) {
                        chSel.innerHTML = '<option value="all">All</option>' + chapters.map(c => `<option value="${escapeHTML(c)}">${escapeHTML(c)}</option>`).join('');
                        chSel.value = 'all'; chSel.dispatchEvent(new Event('change'));
                    }
                });
                setTimeout(() => examSubject.dispatchEvent(new Event('change')), 10);
            }

            // Study filters
            const studySubject = $('#studySubject');
            if (studySubject) studySubject.addEventListener('change', function() { AppState.studyFilter.subject = this.value; AppState.studyFilter.chapter = 'all'; AppState.studyFilter.topic = 'all'; AppState.studyFilter.subtopic = 'all'; navigateTo('study'); });
            const studyChapter = $('#studyChapter');
            if (studyChapter) studyChapter.addEventListener('change', function() { AppState.studyFilter.chapter = this.value; AppState.studyFilter.topic = 'all'; AppState.studyFilter.subtopic = 'all'; navigateTo('study'); });
            const studyTopic = $('#studyTopic');
            if (studyTopic) studyTopic.addEventListener('change', function() { AppState.studyFilter.topic = this.value; AppState.studyFilter.subtopic = 'all'; navigateTo('study'); });
            const studySubtopic = $('#studySubtopic');
            if (studySubtopic) studySubtopic.addEventListener('change', function() { AppState.studyFilter.subtopic = this.value; navigateTo('study'); });
            const studyBook = $('#studyBook');
            if (studyBook) studyBook.addEventListener('change', function() { AppState.studyFilter.book = this.value; navigateTo('study'); });

            // Study mode buttons
            $$('[data-study-mode]').forEach(btn => { btn.addEventListener('click', function() { AppState.studyFilter.mode = this.dataset.studyMode; if(this.dataset.studyMode !== 'lectureReader') AppState.studyFilter.lectureId = null; navigateTo('study'); }); });

            // --- LECTURE LISTENERS ---
            $$('.lecture-card').forEach(card => {
                card.addEventListener('click', function(e) {
                    if (e.target.closest('.lecture-exam-btn')) return;
                    AppState.studyFilter.lectureId = parseInt(this.dataset.lid);
                    AppState.studyFilter.mode = 'lectureReader';
                    renderViewSafely('study');
                });
            });
            $$('.lecture-exam-btn').forEach(btn => {
                btn.addEventListener('click', async function(e) {
                    e.stopPropagation();
                    const lid = parseInt(this.dataset.lid);
                    const l = await db.getLecture(lid);
                    if (!l) return;
                    await startExamFromLecture(l);
                });
            });
            const btnAddLecture = $('#btnAddLecture');
            if (btnAddLecture) btnAddLecture.addEventListener('click', () => showAddLectureModal());
            const btnDeleteLecture = $('#btnDeleteLecture');
            if (btnDeleteLecture) {
                btnDeleteLecture.addEventListener('click', async function() {
                    const lid = parseInt(this.dataset.lid);
                    if (!confirm('Delete this lecture?')) return;
                    await db.deleteLecture(lid);
                    showToast('Lecture deleted', 'success');
                    AppState.studyFilter.mode = 'lectures';
                    AppState.studyFilter.lectureId = null;
                    renderViewSafely('study');
                });
            }
            const btnExamLectureAttached = $('#btnExamLectureAttached');
            if (btnExamLectureAttached) {
                btnExamLectureAttached.addEventListener('click', async function() {
                    const lid = parseInt(this.dataset.lid);
                    await startExamFromLectureAttached(lid);
                });
            }
            const btnExamChapterAllBooks = $('#btnExamChapterAllBooks');
            if (btnExamChapterAllBooks) {
                btnExamChapterAllBooks.addEventListener('click', async function() {
                    const l = { subject: this.dataset.subj, chapter: this.dataset.chap };
                    await startExamFromChapterAllBooks(l);
                });
            }
            const lectureSubject = $('#lectureSubjectFilter');
            if (lectureSubject) lectureSubject.addEventListener('change', function() { AppState.studyFilter.subject = this.value; AppState.studyFilter.chapter = 'all'; renderViewSafely('study'); });
            const lectureChapter = $('#lectureChapterFilter');
            if (lectureChapter) lectureChapter.addEventListener('change', function() { AppState.studyFilter.chapter = this.value; renderViewSafely('study'); });

            // Start study
            const startStudy = $('#btnStartStudy');
            if (startStudy) {
                startStudy.addEventListener('click', async function() {
                    const questions = await db.getAllQuestions(); const sf = AppState.studyFilter;
                    let filtered = questions;
                    if (sf.subject !== 'all') filtered = filtered.filter(q => (q.subject || 'Uncategorized') === sf.subject);
                    if (sf.chapter !== 'all') filtered = filtered.filter(q => (q.chapter || 'General') === sf.chapter);
                    if (sf.topic !== 'all') filtered = filtered.filter(q => (q.topic || 'General') === sf.topic);
                    if (sf.subtopic !== 'all') filtered = filtered.filter(q => ((q.subtopic || 'General') === sf.subtopic));
                    if (sf.book !== 'all') filtered = filtered.filter(q => (q.book || '') === sf.book);
                    if (sf.mode === 'bookmarked') { const bIds = await db.getAllBookmarkedIds(); filtered = filtered.filter(q => bIds.includes(q.id)); }
                    if (sf.mode === 'highyield') { const hyIds = await db.getAllHighYieldIds(); filtered = filtered.filter(q => hyIds.includes(q.id)); }
                    if (filtered.length === 0) { showToast('No questions match filters.', 'warning'); return; }
                    AppState.studyQuestions = [...filtered].sort(() => Math.random() - 0.5);
                    AppState.studyIndex = 0; AppState.studyAnswers = {}; AppState.studyRevealed = {};
                    renderStudyQuestion();
                });
            }

            // Question list filters
            const qf = AppState.questionFilters;
            const qSubject = $('#questionSubjectFilter');
            const qChapter = $('#questionChapterFilter');
            if (qSubject || qChapter) {
                (async () => {
                    const taxonomy = computeTaxonomy(await db.getAllQuestions());
                    if (qSubject) {
                        qSubject.innerHTML = '<option value="all">All Subjects</option>' + taxonomy.subjects.map(s => `<option value="${escapeHTML(s)}">${escapeHTML(s)}</option>`).join('');
                        qSubject.value = qf.subject;
                    }
                    if (qChapter) {
                        let chapters = taxonomy.allChapters;
                        if (qf.subject !== 'all' && taxonomy.chaptersBySubject[qf.subject]) chapters = taxonomy.chaptersBySubject[qf.subject];
                        qChapter.innerHTML = '<option value="all">All Chapters</option>' + chapters.map(c => `<option value="${escapeHTML(c)}">${escapeHTML(c)}</option>`).join('');
                        qChapter.value = qf.chapter;
                    }
                })();
            }
            if (qSubject) {
                qSubject.addEventListener('change', function() {
                    AppState.questionFilters.subject = this.value;
                    AppState.questionFilters.chapter = 'all';
                    renderViewSafely('questions');
                });
            }
            if (qChapter) {
                qChapter.addEventListener('change', function() {
                    AppState.questionFilters.chapter = this.value;
                    renderViewSafely('questions');
                });
            }
            const qTopic = $('#questionTopicFilter');
            if (qTopic) {
                qTopic.value = qf.topic;
                qTopic.addEventListener('change', function() {
                    AppState.questionFilters.topic = this.value;
                    renderViewSafely('questions');
                });
            }
            const qDiff = $('#questionDifficultyFilter');
            if (qDiff) {
                qDiff.value = qf.difficulty;
                qDiff.addEventListener('change', function() {
                    AppState.questionFilters.difficulty = this.value;
                    renderViewSafely('questions');
                });
            }
            $$('[data-qfilter]').forEach(btn => {
                btn.addEventListener('click', function() {
                    const special = this.dataset.qfilter;
                    AppState.questionFilters.special = special;
                    renderViewSafely('questions');
                });
            });

            // Start exam
            const startExam = $('#btnStartExam');
            if (startExam) {
                startExam.addEventListener('click', async function() {
                    try {
                        const selectedSubjects = ($('#examSubject')?.value && $('#examSubject').value!=='all') ? [$('#examSubject').value] : [];
                        const selectedChapters = ($('#examChapter')?.value && $('#examChapter').value!=='all') ? [$('#examChapter').value] : [];
                        const selectedGroups = ($('#examBook')?.value && $('#examBook').value!=='all') ? [$('#examBook').value] : [];
                        const count = parseInt($('#examCount')?.value || 20); const timerMin = parseInt($('#examTimerMinutes')?.value || 0);
                        const difficulty = $('#examDifficulty')?.value || 'all';
                        let questions = await db.getAllQuestions();
                        if (selectedSubjects.length) questions = questions.filter(q => selectedSubjects.includes(q.subject || 'Uncategorized'));
                        if (selectedChapters.length) questions = questions.filter(q => selectedChapters.includes(q.chapter || 'General'));
                        if (selectedGroups.length) questions = questions.filter(q => selectedGroups.includes(q.group || ''));
                        if (difficulty !== 'all') questions = questions.filter(q => q.difficulty === difficulty);
                        if (questions.length === 0) { showToast('No questions available.', 'warning'); return; }
                        AppState.examQuestions = [...questions].sort(() => Math.random() - 0.5).slice(0, Math.min(count, questions.length));
                        AppState.examAnswers = { currentIndex: 0 }; AppState._examSaved = false;
                        AppState.examInProgress = true;
                        AppState.examShowResults = false; AppState.lastExamResults = null;
                        AppState.examTimeRemaining = timerMin * 60; AppState.examStartTime = Date.now();
                        startExamTimer();
                        renderViewSafely('exam');
                    } catch (e) { showToast('Error: ' + e.message, 'error'); }
                });
            }

            const nextQ = $('#btnNextQ');
            if (nextQ) {
                nextQ.addEventListener('click', function() {
                    const idx = AppState.examAnswers.currentIndex || 0;
                    if (idx < AppState.examQuestions.length - 1) { AppState.examAnswers.currentIndex = idx + 1; renderViewSafely('exam'); }
                    else { submitExam(); }
                });
            }
            const prevQ = $('#btnPrevQ');
            if (prevQ) prevQ.addEventListener('click', function() { const idx = AppState.examAnswers.currentIndex || 0; if (idx > 0) { AppState.examAnswers.currentIndex = idx - 1; renderViewSafely('exam'); } });
            const endExam = $('#btnEndExam');
            if (endExam) endExam.addEventListener('click', function() { if (confirm('End exam and submit?')) submitExam(); });

            const reviewExam = $('#btnReviewExam');
            if (reviewExam) reviewExam.addEventListener('click', reviewExamResults);

            $$('.option-btn[data-option]').forEach(btn => {
                btn.addEventListener('click', function() {
                    const idx = AppState.examAnswers.currentIndex || 0; const q = AppState.examQuestions[idx];
                    if (q) AppState.examAnswers[q.id] = this.dataset.option;
                    renderViewSafely('exam');
                });
            });

            $$('.bookmark-btn').forEach(b => { if (b.closest('#questionListContainer')) return; b.addEventListener('click', async function(e) { e.stopPropagation(); const id = parseInt(this.dataset.qid); await db.toggleBookmark(id); renderViewSafely(AppState.currentView); }); });
            $$('.view-q-btn').forEach(b => { if (b.closest('#questionListContainer')) return; b.addEventListener('click', async function() { const q = await db.getQuestion(parseInt(this.dataset.qid)); if (q) showQuestionModal(q); }); });

            // The virtualized question list mounts/unmounts .question-block nodes as the user
            // scrolls (see VirtualScroller), so per-node listeners bound only at initial render
            // would silently do nothing for anything scrolled into view afterward. One delegated
            // listener on the stable container covers every row regardless of when it was mounted.
            const qListContainerForDelegation = $('#questionListContainer');
            if (qListContainerForDelegation) {
                qListContainerForDelegation.addEventListener('click', async function(e) {
                    const bmBtn = e.target.closest('.bookmark-btn');
                    if (bmBtn) {
                        e.stopPropagation();
                        const id = parseInt(bmBtn.dataset.qid);
                        await db.toggleBookmark(id);
                        renderViewSafely(AppState.currentView);
                        return;
                    }
                    const viewBtn = e.target.closest('.view-q-btn');
                    if (viewBtn) {
                        const q = await db.getQuestion(parseInt(viewBtn.dataset.qid));
                        if (q) showQuestionModal(q);
                    }
                });
            }
            const addQ = $('#btnAddQuestion'); if (addQ) addQ.addEventListener('click', function() { showAddQuestionModal(null); });
            const clearAll = $('#btnClearAll'); if (clearAll) clearAll.addEventListener('click', clearAllHandler);
            const importBtn = $('#btnImport'); if (importBtn) importBtn.addEventListener('click', window.handleImport);
            const sampleBtn = $('#btnLoadSample'); if (sampleBtn) sampleBtn.addEventListener('click', loadSamples);
            const exportBtn = $('#btnExport'); if (exportBtn) exportBtn.addEventListener('click', handleExport);
            const restoreBtn = $('#btnRestore'); if (restoreBtn) restoreBtn.addEventListener('click', function() { $('#restoreFile').click(); });
            const restoreFile = $('#restoreFile'); if (restoreFile) restoreFile.addEventListener('change', handleRestore);

            const importFile = $('#importFile');
            if (importFile) importFile.addEventListener('change', function(e) { const file = e.target.files[0]; if (!file) return; const r = new FileReader(); r.onload = ev => $('#importData').value = ev.target.result; r.readAsText(file); });

            populateDeleteBookDropdown();
            const delGroupBtn = $('#btnDeleteGroup');
            if (delGroupBtn) delGroupBtn.addEventListener('click', async () => {
                const groupName = ($('#deleteGroupName')?.value || '').trim();
                if (!groupName) { alert('Enter book/group name'); return; }
                if (!confirm(`Delete all questions from "${groupName}" only?`)) return;
                const deleted = await db.deleteQuestionsByGroup(groupName);
                showToast(`${deleted} questions deleted from ${groupName}`, 'success');
                renderViewSafely('import');
            });

            // OPTIMIZATION: Debounced search using the in-memory index
            const searchInput = $('#questionSearchInput');
            if (searchInput) {
                searchInput.addEventListener('input', debounce(function() {
                    AppState.searchQuery = this.value;
                    renderViewSafely('questions').then(() => {
                        const el = document.getElementById('questionSearchInput');
                        if (el) {
                            el.focus();
                            el.setSelectionRange(AppState.searchQuery.length, AppState.searchQuery.length);
                        }
                    });
                }, 150));
            }

            // --- Admin Dashboard Listeners ---
            const btnAdminAddQ = $('#btnAdminAddQ');
            if (btnAdminAddQ) btnAdminAddQ.addEventListener('click', () => showAddQuestionModal(null));

            const btnAdminBulkImport = $('#btnAdminBulkImport');
            if (btnAdminBulkImport) btnAdminBulkImport.addEventListener('click', () => { AppState.currentView = 'import'; renderViewSafely('import'); });

            const btnAdminBulkEdit = $('#btnAdminBulkEdit');
            if (btnAdminBulkEdit) btnAdminBulkEdit.addEventListener('click', adminBulkEdit);

            const btnAdminMergeDups = $('#btnAdminMergeDups');
            if (btnAdminMergeDups) btnAdminMergeDups.addEventListener('click', adminMergeDuplicates);

            const btnAdminReclassify = $('#btnAdminReclassify');
            if (btnAdminReclassify) btnAdminReclassify.addEventListener('click', adminBulkReclassify);

            const btnAdminClearAll = $('#btnAdminClearAll');
            if (btnAdminClearAll) btnAdminClearAll.addEventListener('click', clearAllHandler);

            // Admin question search
            const adminQSearch = $('#adminQSearch');
            if (adminQSearch) {
                adminQSearch.addEventListener('input', debounce(async function() {
                    const results = await adminSearchQuestions(this.value);
                    await adminRenderQuestionList(results);
                    // Re-attach edit/delete listeners after re-render
                    $$('.admin-edit-q').forEach(b => b.addEventListener('click', function() { adminEditQuestion(parseInt(this.dataset.qid)); }));
                    $$('.admin-del-q').forEach(b => b.addEventListener('click', function() { adminDeleteQuestion(parseInt(this.dataset.qid)); }));
                }, 200));
            }

            // Admin edit/delete buttons (initial render)
            $$('.admin-edit-q').forEach(b => b.addEventListener('click', function() { adminEditQuestion(parseInt(this.dataset.qid)); }));
            $$('.admin-del-q').forEach(b => b.addEventListener('click', function() { adminDeleteQuestion(parseInt(this.dataset.qid)); }));

            // --- End Admin Dashboard Listeners ---

            // --- Student Dashboard Listeners ---
            const btnSetDailyGoal = $('#btnSetDailyGoal');
            if (btnSetDailyGoal) {
                btnSetDailyGoal.addEventListener('click', async () => {
                    const current = await getDailyGoal();
                    const val = prompt('Set your daily question goal:', current);
                    if (val !== null) {
                        const n = parseInt(val, 10);
                        if (n > 0 && n <= 500) {
                            await setDailyGoal(n);
                            showToast(`Daily goal set to ${n} questions.`, 'success');
                            navigateTo('dashboard');
                        } else {
                            showToast('Please enter a number between 1 and 500.', 'warning');
                        }
                    }
                });
            }

            const btnContinueStudy = $('#btnContinueStudy');
            if (btnContinueStudy) {
                btnContinueStudy.addEventListener('click', continueStudying);
            }

            const btnSmartRevision = $('#btnSmartRevision');
            if (btnSmartRevision) {
                btnSmartRevision.addEventListener('click', startSmartRevision);
            }

            const btnAdaptiveQuiz = $('#btnAdaptiveQuiz');
            if (btnAdaptiveQuiz) {
                btnAdaptiveQuiz.addEventListener('click', startAdaptiveExam);
            }
            // --- End Student Dashboard Listeners ---

            // OPTIMIZATION: Initialize Virtual Scroller for question list
            const qContainer = $('#questionListContainer');
            if (qContainer && AppState._lastFilteredQuestions && AppState._lastFilteredQuestions.length > 0) {
                if (AppState._questionScroller) {
                    AppState._questionScroller.destroy();
                }
                AppState._questionScroller = new VirtualScroller(qContainer, {
                    items: AppState._lastFilteredQuestions,
                    itemHeight: 190, // measured actual rendered height is ~155-216px; was 130 (up to 41% low), which made the scroller over-render extra items per scroll step
                    buffer: 4,
                    pageSize: 50,
                    renderItem: (q, i) => renderQuestionBlock(q, i, AppState._lastFilterMeta)
                });
                AppState._questionScroller.init();
            }

            // Update Package System (Settings view) — defined in update-package.js
            if (typeof attachSettingsListeners === 'function') attachSettingsListeners();
        }

        /** Simple debounce utility for search input */
        function debounce(fn, ms) {
            let t;
            return function(...args) {
                clearTimeout(t);
                t = setTimeout(() => fn.apply(this, args), ms);
            };
        }

        // ============================================================
        //  Update Package System — see update-package.js
        //  (Prior prototype here — password-encrypted .ent files signed
        //  with a keypair embedded in this same client-side bundle — has
        //  been retired. That approach couldn't keep a signing key secret
        //  from students since everyone loads the same app.js, so it gave
        //  the appearance of security more than the substance of it. The
        //  new system is upfront: a real SHA-256 checksum for accidental
        //  corruption, and a clearly-labeled signature placeholder.)
        // ============================================================
        document.getElementById('btnDarkMode').addEventListener('click', () => { AppState.darkMode = !AppState.darkMode; document.body.classList.toggle('dark-mode', AppState.darkMode); document.getElementById('btnDarkMode').innerHTML = window.ENTPaidThemeIcon(AppState.darkMode); saveSession(); });
        document.getElementById('btnSearch').addEventListener('click', () => { navigateTo('questions'); setTimeout(() => { const inp = $('#questionSearchInput'); if (inp) inp.focus(); }, 150); });
        document.getElementById('btnSettings').addEventListener('click', () => navigateTo('settings'));

        // ============================================================
        //  SECURE PASSWORD PROTECTED ACTIONS
        // ============================================================

        window.clearAllHandler = async function() {
            if (!RBAC.requireAdmin()) { return; }
            const groups = await db.getAllGroups();
            const modal = $('#modalOverlay');
            const content = $('#modalContent');
            const groupOptions = groups.map(g => `<option value="${escapeHTML(g)}">${escapeHTML(g)}</option>`).join('');
            content.innerHTML = `
                <h3>🗑 Clear Data</h3>
                <div style="margin-bottom:15px;">
                    <label>Delete entire Group:</label>
                    <select id="clearGroupSelect" style="margin-bottom:10px;">
                        ${groupOptions.length > 0 ? groupOptions : '<option>No groups found</option>'}
                    </select>
                    <button class="btn btn-danger" onclick="executeClearGroup()">Delete Selected Group</button>
                </div>
                <hr>
                <button class="btn btn-danger" onclick="executeClear('questions')">Delete ALL Questions</button>
                <button class="btn btn-danger" onclick="executeClear('all')">WIPE EVERYTHING</button>
                <button class="btn btn-outline btn-block mt-2" onclick="closeModal()">Cancel</button>
            `;
            modal.classList.remove('hidden');
        };

        window.executeClearGroup = async function() {
            const groupToClear = $('#clearGroupSelect').value;
            if (!confirm(`Are you sure you want to delete the entire group: "${groupToClear}"?`)) return;
            const qs = await db.getAllQuestions();
            const tx = db.db.transaction('questions', 'readwrite');
            const store = tx.objectStore('questions');
            qs.forEach(q => { if (q.group === groupToClear) store.delete(q.id); });
            tx.oncomplete = () => { closeModal(); showToast(`Group deleted.`, 'success'); navigateTo('dashboard'); };
        };

        window.executeClear = async function(type) {
            if (!confirm("Are you sure? This action cannot be undone.")) return;
            const tx = db.db.transaction(['questions', 'examHistory', 'bookmarks', 'notes', 'performance', 'highYield'], 'readwrite');
            if (type === 'questions') tx.objectStore('questions').clear();
            if (type === 'all') {
                tx.objectStore('questions').clear();
                tx.objectStore('examHistory').clear(); tx.objectStore('performance').clear(); tx.objectStore('highYield').clear();
                tx.objectStore('bookmarks').clear();
                tx.objectStore('notes').clear();
            }
            tx.oncomplete = () => { closeModal(); showToast('Data cleared.', 'success'); navigateTo('dashboard'); };
        };

        (async function init() {
            await db.ready;
            cleanupLegacyStorage();
            try {
                const migrationReport = await db.migrateToScottBrown();
                if (migrationReport.classified || migrationReport.subjectOnly || migrationReport.unmapped) {
                    console.log('Scott-Brown classification migration:', migrationReport);
                }
            } catch (e) {
                console.error('Classification migration failed:', e);
            }
            RBAC.init();
            applyRoleVisibility();
            const adminBtn = document.getElementById('btnAdminMode');
            if (adminBtn) adminBtn.addEventListener('click', () => RBAC.toggle());
            $$('.nav-item').forEach(item => { item.addEventListener('click', function() { const view = this.dataset.view; if (view) navigateTo(view); }); });

            // Back-button support: respond to browser/hardware back instead of
            // letting it exit the PWA. A separate observer pushes a history
            // entry whenever the shared modal overlay opens (regardless of
            // which function opened it), so back also closes dialogs first.
            window.addEventListener('popstate', handlePopState);
            const modalOverlayEl = document.getElementById('modalOverlay');
            if (modalOverlayEl && window.MutationObserver) {
                new MutationObserver(() => {
                    const isOpen = !modalOverlayEl.classList.contains('hidden');
                    if (isOpen && !(history.state && history.state.modal)) {
                        history.pushState({ view: AppState.currentView, modal: true }, '', location.href);
                    }
                }).observe(modalOverlayEl, { attributes: true, attributeFilter: ['class'] });
            }

            const restored = restoreSession();
            if (restored) {
                // Startup must always land on Dashboard, regardless of which view was
                // open when the session was last saved. Everything else restored above
                // (exam progress/timer, study progress, filters, dark mode) is left as
                // restored — only the initial screen is overridden here.
                AppState.currentView = 'dashboard';
                document.body.classList.toggle('dark-mode', AppState.darkMode);
                document.getElementById('btnDarkMode').innerHTML = window.ENTPaidThemeIcon(AppState.darkMode);
                $$('.nav-item').forEach(n => n.classList.remove('active'));
                const navBtn = $(`.nav-item[data-view="${AppState.currentView}"]`);
                if (navBtn) navBtn.classList.add('active');
                if (window.ENTSubscription.canAccess() && AppState.examInProgress && AppState.examTimeRemaining > 0) startExamTimer();
                history.replaceState({ view: AppState.currentView }, '', location.href);
                await renderViewSafely(AppState.currentView);
                if (AppState.currentView === 'study' && AppState.studyQuestions && AppState.studyIndex < AppState.studyQuestions.length) {
                    renderStudyQuestion();
                }
            } else {
                try {
                    const legacyDark = await db.getSetting('darkMode', false);
                    if (legacyDark) {
                        AppState.darkMode = true;
                        document.body.classList.add('dark-mode');
                        document.getElementById('btnDarkMode').textContent = '☀️';
                    }
                } catch (e) {}
                history.replaceState({ view: 'dashboard' }, '', location.href);
                isPopNavigation = true; // this is the app's first screen - replace, don't push
                navigateTo('dashboard');
                isPopNavigation = false;
            }
        })();

        // ============================================================
        //  PASSWORD PROTECTION FOR SENSITIVE ACTIONS
        // ============================================================
        const originalImport = window.handleImport;
        window.handleImport = async function() {
            if (!RBAC.requireAdmin()) {
                return;
            }
            const format = $('#importFormat').value; const raw = $('#importData').value; const groupName = $('#importGroup').value.trim();
            try {
                let questions = [];
                if (format === 'json') questions = JSON.parse(raw);
                else if (format === 'csv') questions = parseCSV(raw);
                if (!Array.isArray(questions) || questions.length === 0) throw new Error('No valid questions');
                if (!validateImportedQuestionsStrict(questions)) {
                    throw new Error('Invalid question structure: each question must have questionText and correctAnswer');
                }
                const count = await db.bulkImport(questions, groupName);
                showToast(`Imported ${count} questions!`, 'success');
                navigateTo('dashboard');
            } catch (e) { showToast('Import error: ' + e.message, 'error'); }
        };

        window.clearAllHandler = async function() {
            if (!RBAC.requireAdmin()) {
                return;
            }
            if (confirm('⚠️ WARNING: This will delete EVERYTHING. Are you sure?')) {
                await db.clearAllQuestions();
                showToast('All data cleared.', 'success');
                navigateTo('dashboard');
            }
        };

        window.generateWeakTopicAnalytics = async function(){
            const perf = await db.getPerformance();
            const stats = {};
            perf.forEach(r=>{
                const key = `${r.subject||'Unknown'}|||${r.chapter||'Unknown'}|||${r.topic||'Unknown'}`;
                if(!stats[key]) stats[key]={total:0,correct:0,subject:r.subject||'Unknown',chapter:r.chapter||'Unknown',topic:r.topic||'Unknown'};
                stats[key].total++;
                if(r.correct) stats[key].correct++;
            });
            return Object.values(stats)
                .map(x=>({...x,accuracy:Math.round((x.correct*100)/x.total)}))
                .sort((a,b)=>a.accuracy-b.accuracy);
        };

        async function populateDeleteBookDropdown(){
            const sel=document.getElementById('deleteGroupName');
            if(!sel) return;
            const groups=await db.getAllGroups();
            sel.innerHTML='<option value="">Select Book</option>'+groups.map(g=>`<option value="${escapeHTML(g)}">${escapeHTML(g)}</option>`).join('');
        }

        document.addEventListener('click', async (e)=>{
            if(e.target.id==='btnExamFromMistakes'){
                const perf=await db.getPerformance();
                const latest={}; perf.forEach(x=>latest[x.questionId]=x.correct);
                const wrongIds=Object.keys(latest).filter(k=>latest[k]===false).map(Number);
                const qs=(await db.getAllQuestions()).filter(q=>wrongIds.includes(q.id));
                AppState._examSaved=false;
                AppState.examQuestions=qs;
                AppState.examAnswers={currentIndex:0};
                AppState.examInProgress=true;
                AppState.examShowResults=false; AppState.lastExamResults=null;
                AppState.examStartTime=Date.now();
                AppState.examTimeRemaining=0;
                if (AppState.examTimer) { clearInterval(AppState.examTimer); AppState.examTimer=null; }
                renderViewSafely('exam');
            }
            if(e.target.classList.contains('add-hy')){
                await db.toggleHighYield(Number(e.target.dataset.qid));
                showToast('Added to High Yield','success');
                renderViewSafely('mistakes');
            }
            if(e.target.classList.contains('retry-question')){
                const qid=Number(e.target.dataset.qid);
                const q=await db.getQuestion(qid);
                if(!q) return;
                AppState.studyQuestions=[q];
                AppState.studyIndex=0;
                AppState.studyAnswers={};
                AppState.studyRevealed={};
                await navigateTo('study');
                renderStudyQuestion();
            }
            if(e.target.classList.contains('remove-hy')){
                const qid=Number(e.target.dataset.qid);
                await db.toggleHighYield(qid);
                showToast('Removed from High Yield', 'success');
                renderViewSafely('highyield');
            }
        });

        function updateAvailableQuestionsInfo(){
            try{
                const info=document.getElementById('availableQuestionsInfo');
                if(!info || !window.db) return;
                db.getAllQuestions().then(qs=>{
                    const subjSel=document.getElementById('examSubject');
                    const grpSel=document.getElementById('examBook');
                    let filtered=[...qs];
                    const subjects=subjSel?[...subjSel.selectedOptions].map(x=>x.value).filter(v=>v!=='all'):[];
                    const groups=grpSel?[...grpSel.selectedOptions].map(x=>x.value).filter(v=>v!=='all'):[];
                    if(subjects.length) filtered=filtered.filter(q=>subjects.includes(q.subject));
                    if(groups.length) filtered=filtered.filter(q=>groups.includes(q.group));
                    info.textContent='Available Questions: '+filtered.length;
                });
            }catch(e){}
        }
        document.addEventListener('change',e=>{
            if(e.target && (e.target.id==='examSubject' || e.target.id==='examBook')){
                updateAvailableQuestionsInfo();
            }
        });

        async function populateExamChapters(){
            const subj=document.getElementById('examSubject');
            const chap=document.getElementById('examChapter');
            if(!subj||!chap) return;
            const taxonomy = computeTaxonomy(await db.getAllQuestions());
            const selected=[...subj.selectedOptions].map(o=>o.value).filter(v=>v!=='all');
            let chapters=[];
            if(selected.length===0){ chapters=taxonomy.allChapters; }
            else{
                selected.forEach(s=>{ if(taxonomy.chaptersBySubject[s]) chapters.push(...taxonomy.chaptersBySubject[s]); });
            }
            chap.innerHTML='<option value="all">All</option>'+
                [...new Set(chapters)].sort((a,b)=>a.localeCompare(b)).map(c=>`<option value="${escapeHTML(c)}">${escapeHTML(c)}</option>`).join('');
        }

        document.addEventListener('change',function(e){
            if(e.target && e.target.id==='examSubject'){
                populateExamChapters();
                if(typeof updateAvailableQuestionsInfo==='function') updateAvailableQuestionsInfo();
            }
        });

        document.addEventListener('change',function(e){
            if(e.target && (e.target.id==='examChapter' || e.target.id==='examTopic')){
                if(typeof updateAvailableQuestionsInfo==='function') updateAvailableQuestionsInfo();
            }
        });

        async function populateExamTopics(){
            const chapter=document.getElementById('examChapter');
            const topic=document.getElementById('examTopic');
            if(!chapter || !topic) return;
            const qs=await db.getAllQuestions();
            let filtered=qs;
            if(chapter.value!=='all'){
                filtered=filtered.filter(q=>(q.chapter||'General')===chapter.value);
            }
            const topics=[...new Set(filtered.map(q=>q.topic).filter(Boolean))].sort();
            topic.innerHTML='<option value="all">All</option>'+topics.map(t=>`<option value="${escapeHTML(t)}">${escapeHTML(t)}</option>`).join('');
        }

        async function updateExamCounters(){
            const info=document.getElementById('availableQuestionsInfo');
            if(!info) return;
            const qs=await db.getAllQuestions();
            info.innerHTML='Total Questions: '+qs.length;
        }

        document.addEventListener('change',async function(e){
            if(e.target && e.target.id==='examChapter'){
                await populateExamTopics();
            }
        });

        document.addEventListener('DOMContentLoaded',function(){
            setTimeout(()=>{
                if(typeof populateExamChapters==='function') populateExamChapters();
                if(typeof updateExamCounters==='function') updateExamCounters();
            },500);
        });

                window.ENTApp.quiz=window.ENTApp.quiz||{}; window.ENTApp.quiz.classifyQuestionAdvanced=classifyQuestionAdvanced;
        window.ENTApp.quiz=window.ENTApp.quiz||{}; window.ENTApp.quiz.getQuestionsNeedingReview=getQuestionsNeedingReview;
        window.ENTApp.quiz=window.ENTApp.quiz||{}; window.ENTApp.quiz.scanDuplicateQuestions=scanDuplicateQuestions;
        window.ENTApp.quiz=window.ENTApp.quiz||{}; window.ENTApp.quiz.adaptiveExamEngine=adaptiveExamEngine;
        window.ENTApp.quiz=window.ENTApp.quiz||{}; window.ENTApp.quiz.fullBoardExamSimulator=fullBoardExamSimulator;
        window.ENTApp.quiz=window.ENTApp.quiz||{}; window.ENTApp.quiz.smartQuestionSelector=smartQuestionSelector;
        window.ENTApp.quiz=window.ENTApp.quiz||{}; window.ENTApp.quiz.optimizeFor100kQuestions=optimizeFor100kQuestions;
        window.ENTApp.quiz=window.ENTApp.quiz||{}; window.ENTApp.quiz.iraqiBoardMockExam=iraqiBoardMockExam;
        window.ENTApp.quiz=window.ENTApp.quiz||{}; window.ENTApp.quiz.updateQuestionClassification=updateQuestionClassification;
        window.ENTApp.quiz=window.ENTApp.quiz||{}; window.ENTApp.quiz.renderExamSetup=renderExamSetup;
        window.ENTApp.quiz=window.ENTApp.quiz||{}; window.ENTApp.quiz.renderExamInProgress=renderExamInProgress;
        window.ENTApp.quiz=window.ENTApp.quiz||{}; window.ENTApp.quiz.renderExamResults=renderExamResults;
        window.ENTApp.quiz=window.ENTApp.quiz||{}; window.ENTApp.quiz.reviewExamResults=reviewExamResults;
        window.ENTApp.quiz=window.ENTApp.quiz||{}; window.ENTApp.quiz.renderQuestionList=renderQuestionList;
        window.ENTApp.quiz=window.ENTApp.quiz||{}; window.ENTApp.quiz.renderStudyQuestion=renderStudyQuestion;
        window.ENTApp.quiz=window.ENTApp.quiz||{}; window.ENTApp.quiz.submitExam=submitExam;
        window.ENTApp.quiz=window.ENTApp.quiz||{}; window.ENTApp.quiz.showQuestionModal=showQuestionModal;
        window.ENTApp.quiz=window.ENTApp.quiz||{}; window.ENTApp.quiz.updateAvailableQuestionsInfo=updateAvailableQuestionsInfo;
        window.ENTApp.quiz=window.ENTApp.quiz||{}; window.ENTApp.quiz.populateExamChapters=populateExamChapters;
        window.ENTApp.quiz=window.ENTApp.quiz||{}; window.ENTApp.quiz.populateExamTopics=populateExamTopics;
        window.ENTApp.quiz=window.ENTApp.quiz||{}; window.ENTApp.quiz.updateExamCounters=updateExamCounters;
                (function(){
            if(!window.ENTApp)return;
            const names=['startQuiz','loadQuestions','renderQuestion','checkAnswer','nextQuestion','previousQuestion'];
            names.forEach(n=>{ if(typeof window[n]==='function'){window.ENTApp.modules.app[n]=window[n];}});
        })();
