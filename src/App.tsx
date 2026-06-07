import { useState, useEffect, useRef } from 'react'
import './App.css'

// Resume/CV text shown in the CV window (when clicking Resume/CV icon)
const RESUME_TEXT = `Guoqing Kang (Eucal)
07536-248421 · gkang002@gold.ac.uk · SE13 TY

Personal Profile
Creative and compassionate arts professional with a BA and MA in Art Education, seven years' teaching experience, and a strong track record in museum visitor engagement and exhibition support. Skilled in delivering outstanding customer service, assisting with exhibition installation, and facilitating workshops for diverse audiences, including those around sensitive community themes. Reliable, detail-oriented, and committed to creating welcoming and inclusive spaces that enhance the visitor experience.

Work History

Pastry Chef
Kimpton Fitzory Hotel, London (12/2025–present)
• Prepared English afternoon tea items including sandwiches, desserts, and scones to a high standard.
• Ensured consistent quality and presentation of all dishes.
• Supported and trained junior staff.
• Monitored stock levels and supported seasonal menu updates.
• Completed daily kitchen duties while maintaining food safety and hygiene standards.

Pastry Chef
Pyro, London (09/2025–10/2025)
• Prepared and plated daily desserts to a high standard, ensuring consistency and efficiency during service.
• Worked closely with a Michelin-level team, contributing to a culture of precision and continuous improvement.
• Supported and trained junior staff.
• Assisted the Head Chef with daily purchasing records and ingredient reporting.
• Planned and organised next-day production tasks to ensure smooth kitchen operations.

Chef
Lahpet, London (07/2024–09/2025)
• Prepared and cooked dishes to a high standard.
• Managed food preparation, stock, and kitchen hygiene.
• Supported and trained junior staff.
• Stayed calm and organised during busy service times.
• Followed health, safety, and allergen regulations.

Freelance Art Teacher
Online, London (09/2022–Present)
• Created and delivered interactive art lessons for groups of 8–12 students, incorporating sensory-friendly materials for SEN learners.
• Developed differentiated lesson plans to accommodate students' individual needs and abilities.
• Maintained regular communication with parents, providing progress updates and recommendations.

Community Garden Support (Volunteer)
Royal Museum Greenwich, London (11/2023–02/2024)
• Assisted young learners, including those with additional needs, in outdoor activities promoting sensory experiences.
• Managed outdoor emergencies and ensured student safety in an engaging environment.

Sewing Teacher (Volunteer)
Hestia Life Beyond Crisis, London (10/2023–07/2024)
• Guided participants in creative sewing projects, fostering fine motor skills and confidence.
• Provided emotional support and encouraged social interaction among learners.

Chinese Teacher (Part-time)
Speak Like a Native, London (09/2023–05/2024)
• Delivered engaging Mandarin lessons tailored for children with diverse learning styles, including those with SEN.
• Used scenario-based approaches to make lessons interactive and accessible.

Art Teacher Assistant (Volunteer)
Halley House School, London (04/2023–07/2023)
• Assisted in primary school art lessons, supporting SEN students with one-on-one guidance.
• Introduced adaptive art techniques and materials for students with sensory processing difficulties.
• Helped curate the school art gallery, making art accessible to all learners.

Art Teacher (Full-time)
The China Soong Ching Ling Foundation (07/2020–09/2022)
• Designed and implemented creative arts programs for young learners, including those with additional needs.
• Developed inclusive teaching strategies, ensuring all students could actively participate and express themselves.
• Established an online learning platform to support former students remotely.

Education

MA Art and Learning
Goldsmiths, University of London, UK (2022–2023)
• Focused on inclusive and accessible arts education.
• Courses: Critical Pedagogy in Contested Spaces, Spaces of Practice, Education in the Art Museum.

BA Art Education
Capital Normal University, Beijing, China (2016–2020)
• Courses: Study of Synthetic Material, Research on Language and Material in Painting, History of Art.

Certifications & Qualifications
• Senior Middle School Teacher Qualification Certificate (Fine Art), China
• Putonghua Shuiping Ceshi (Mandarin Proficiency Test), Class A (B), China
• Paediatric First Aid, HighSpeech Training, London
• Autism Awareness, CPD Online College, London
• Knowledge of Food Safety (Food Hygiene & Safety Level 2), London

Key Skills
• Adaptive Teaching Methods – Designed and delivered over 100 interactive lessons tailored for different learning abilities, focusing on engagement and creativity.
• SEN Support & Inclusive Learning – Skilled in differentiating instruction and using assistive technology to support students with diverse needs.
• Behavioural & Emotional Support – Experienced in providing emotional encouragement and creating a safe, structured environment for students.
• Creative Curriculum Development – Designed a 12-week art curriculum to enhance students' engagement and self-expression.
• Strong Communication & Collaboration – Regularly liaises with parents, teachers, and support staff to ensure student progress.
• Workshop & Community Engagement – Delivered arts and crafts workshops in school and community settings, engaging with students of various backgrounds and abilities.

Hobbies & Interests
• Art & Creativity – Passionate about drawing, painting, and exploring new artistic techniques.
• Cooking – Enjoys experimenting with new recipes and sharing meals with friends.
• Community Engagement – Actively participates in volunteer work and cultural exchange programs.

References available upon request`

// External JSON: folder collections for right-side folder icons (Photos, Drawings, etc.)
// content: array of modular format items (center_image, columns, header, image_left, image_right, text_only, video)
type ContentText = { title: string; medium: string; dimensions: string }
type ContentItem =
  | { format: 'center_image'; image: string; text?: ContentText }
  | { format: 'header'; title: string; description: string }
  | { format: 'video'; url: string; description?: string }
  | { format: 'columns'; image1: string; text1?: ContentText; image2: string; text2?: ContentText; image3?: string; text3?: ContentText, image4?: string; text4?: ContentText, image5?: string; text5?: ContentText, image6?: string; text6?: ContentText }
  | { format: 'image_left'; image: string; text: ContentText }
  | { format: 'image_right'; image: string; text: ContentText }
  | { format: 'text_only'; text: ContentText }
type FolderCollection = {
  label: string
  title: string
  description: string
  content: ContentItem[]
}
type FoldersData = { folders: FolderCollection[] }

function renderTextBlock(text: ContentText) {
  return (
    <>
      <p className="font-martian-mono font-semibold text-sm text-black whitespace-pre-wrap">{text.title}</p>
      {text.medium && text.medium !== '—' && (
        <p className="font-martian-mono text-neutral-600 text-xs mt-1">{text.medium}</p>
      )}
      {text.dimensions && text.dimensions !== '—' && (
        <p className="font-martian-mono text-neutral-500 text-xs">{text.dimensions}</p>
      )}
    </>
  )
}

const WINDOW_PADDING = 32
const BOTTOM_BAR_HEIGHT = 48
const MOBILE_BREAKPOINT = 768

function isMobileViewport() {
  return window.innerWidth < MOBILE_BREAKPOINT
}

function getFolderWindowWidthPx() {
  return isMobileViewport() ? window.innerWidth : window.innerWidth * 0.8
}

function FolderWindow({
  title,
  onClose,
  onTitleBarMouseDown,
  children,
  size = 'default',
  folderCollection,
  contentAlign = 'center',
}: {
  title: string
  onClose: () => void
  onTitleBarMouseDown?: (e: React.MouseEvent) => void
  children?: React.ReactNode
  size?: 'default' | 'fullscreen'
  folderCollection?: FolderCollection
  contentAlign?: 'left' | 'center'
}) {
  const isFullscreen = size === 'fullscreen'
  const alignLeft = contentAlign === 'left'

  const renderFolderContent = () => {
    if (folderCollection == null) return children ?? null
    const { title, description, content } = folderCollection
    const header = (
      <>
        {title != null && <h2 className="font-martian-mono text-center font-semibold text-[#7E4661] text-lg mb-1">{title}</h2>}
        {description != null && <p className="font-martian-mono text-sm text-black/80 mb-6">{description}</p>}
      </>
    )

    const renderContentItem = (item: ContentItem, idx: number) => {
      switch (item.format) {
        case 'header':
          return (
            <div key={idx} className="w-full">
              <h3 className="font-martian-mono text-center font-semibold text-[#7E4661] text-base mb-1">{item.title}</h3>
              <p className="font-martian-mono text-sm text-black/80">{item.description}</p>
            </div>
          )
        case 'center_image':
          return (
            <div key={idx} className="flex flex-col w-full">
              <div className="w-full overflow-hidden">
                <img src={item.image} alt="" className="w-full h-auto object-contain" />
              </div>
              {item.text != null && (
                <div className="mt-2 w-full">{renderTextBlock(item.text)}</div>
              )}
            </div>
          )
        case 'columns':
          return (
            <div key={idx} className={`grid gap-1 sm:gap-8 mx-auto w-full ${item.image5 ? 'grid-cols-5' : item.image4 ? 'grid-cols-4' : item.image3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
              <div className="flex flex-col items-start w-fit w-full">
                <div className="w-full overflow-hidden flex items-center justify-center">
                  <img src={item.image1} alt="" className="w-full h-full object-contain" />
                </div>
                {item.text1 != null && (
                  <div className="mt-2">{renderTextBlock(item.text1)}</div>
                )}
              </div>
              <div className="flex flex-col items-start w-fit w-full">
                <div className="w-full overflow-hidden flex items-center justify-center">
                  <img src={item.image2} alt="" className="w-full h-full object-contain" />
                </div>
                {item.text2 != null && (
                  <div className="mt-2">{renderTextBlock(item.text2)}</div>
                )}
              </div>
              {item.image3 && item.image3 !== '—' && (
                <div className="flex flex-col items-start w-fit w-full">
                  <div className="w-full overflow-hidden flex items-center justify-center">
                    <img src={item.image3} alt="" className="w-full h-full object-contain" />
                  </div>
                  {item.text3 != null && (
                    <div className="mt-2">{renderTextBlock(item.text3)}</div>
                  )}
                </div>
              )}
              {item.image4 && item.image4 !== '—' && (
                <div className="flex flex-col items-start w-fit w-full">
                  <div className="w-full overflow-hidden flex items-center justify-center">
                    <img src={item.image4} alt="" className="w-full h-full object-contain" />
                  </div>
                  {item.text4 != null && (
                    <div className="mt-2">{renderTextBlock(item.text4)}</div>
                  )}
                </div>
              )}
              {item.image5 && item.image5 !== '—' && (
                <div className="flex flex-col items-start w-fit w-full">
                  <div className="w-full overflow-hidden flex items-center justify-center">
                    <img src={item.image5} alt="" className="w-full h-full object-contain" />
                  </div>
                  {item.text5 != null && (
                    <div className="mt-2">{renderTextBlock(item.text5)}</div>
                  )}
                </div>
              )}
            </div>
          )
        case 'image_left':
          return (
            <div key={idx} className="grid grid-cols-2 gap-8 mx-auto w-full">
              <div className="flex flex-col items-start w-fit w-full">
                <div className="w-full overflow-hidden flex items-center justify-center">
                  <img src={item.image} alt="" className="w-full h-full object-contain" />
                </div>
              </div>
              <div className="flex flex-col items-start w-fit justify-center w-full">
                <div className="flex flex-col justify-center min-w-0">{renderTextBlock(item.text)}</div>
              </div>
            </div>
          )
        case 'image_right':
          return (
            <div key={idx} className="grid grid-cols-2 gap-8 mx-auto w-full">
            <div className="flex flex-col items-start w-fit justify-center w-full">
              <div className="flex flex-col justify-center min-w-0">{renderTextBlock(item.text)}</div>
            </div>
              <div className="flex flex-col items-start w-fit w-full">
                <div className="w-full overflow-hidden flex items-center justify-center">
                  <img src={item.image} alt="" className="w-full h-full object-contain" />
                </div>
              </div>
            </div>
          )
        case 'text_only':
          return (
            <div key={idx} className="flex flex-col items-start w-full">
              {renderTextBlock(item.text)}
            </div>
          )
        case 'video':
          return (
            <div key={idx} className="flex flex-col w-full">
              <video src={item.url} controls playsInline className="w-full h-auto" />
              {item.description != null && item.description !== '' && (
                <p className="font-martian-mono text-sm text-black/80 mt-2 whitespace-pre-wrap">{item.description}</p>
              )}
            </div>
          )
        default:
          return null
      }
    }

    return (
      <div className={`text-left flex flex-col w-full ${alignLeft ? 'items-start' : 'items-center mx-auto'}`}>
        {header}
        <div className="flex flex-col gap-8 w-full">
          {content.map((item, idx) => renderContentItem(item, idx))}
        </div>
      </div>
    )
  }

  const content = children ?? (folderCollection != null ? renderFolderContent() : null)
  const contentWrapper = alignLeft ? (
    <div className="text-left w-full max-w-4xl mx-auto">{content}</div>
  ) : (
    <div className="text-left w-full max-w-4xl mx-auto">{content}</div>
  )

  return (
    <div className={`rounded-2xl overflow-hidden shadow-2xl flex flex-col bg-[#CDC7F3] p-4 pt-2 border-[3px] border-[#7E4661] ${isFullscreen ? 'w-full md:w-[80vw]' : 'max-w-3xl max-h-sm'}`} style={isFullscreen ? { height: `calc(100vh - ${WINDOW_PADDING * 2}px - ${BOTTOM_BAR_HEIGHT}px)` } : undefined}>
      <div
        className="flex items-center justify-between gap-2 px-3 py-2 shrink-0 cursor-grab active:cursor-grabbing select-none"
        onMouseDown={onTitleBarMouseDown}
      >
        <span className="text-[#7E4661] text-xs font-medium truncate font-martian-mono mb-1">Eucal/{title}</span>
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="w-4 h-4 rounded-full bg-[#FED7AF] border-2 border-[#7E4661]" />
          <div className="w-4 h-4 rounded-full bg-[#AFD78D] border-2 border-[#7E4661]" />
          <div className="w-4 h-4 rounded-full bg-[#F8A8C4] border-2 border-[#7E4661]" onClick={onClose} />
        </div>
      </div>
      <div className={`overflow-auto scrollbar-hide bg-white rounded-b-xl p-4 flex-1 min-h-0 ${isFullscreen ? '' : 'h-[300px] w-[500px]'}`}>
        {contentWrapper}
      </div>
    </div>
  )
}

// Fixed cell size (match Tailwind 5rem / 5.5rem and gap-2 in px for layout math)
const CELL_WIDTH_PX = 80
const CELL_HEIGHT_PX = 88
const GAP_PX = 8
const PADDING_PX = 32

function getGridDimensions() {
  const cols = Math.floor((window.innerWidth - PADDING_PX) / (CELL_WIDTH_PX + GAP_PX))
  const rows = Math.floor((window.innerHeight - PADDING_PX) / (CELL_HEIGHT_PX + GAP_PX))
  return { cols: Math.max(1, cols), rows: Math.max(1, rows) }
}

const DEFAULT_FOLDER_ICON = '/image/icons/folder.png'
const PLAY_FOLDER_ICON = '/image/icons/folder_2.png'
const BAR_ICON_OPTIONS = ['dog_1.png', 'dog_2.png', 'dog_3.png', 'dog_4.png', 'dog_5.png', 'dog_6.png'] as const

function SettingsWindow({
  selectedIcon,
  onSelect,
  onClose,
  onTitleBarMouseDown,
}: {
  selectedIcon: string
  onSelect: (icon: string) => void
  onClose: () => void
  onTitleBarMouseDown?: (e: React.MouseEvent) => void
}) {
  return (
    <div className="rounded-2xl overflow-hidden shadow-2xl flex flex-col bg-[#CDC7F3] p-2 pt-0 border-[3px] border-[#7E4661] min-w-[320px] max-w-[90vw] max-h-[85vh]">
      <div
        className="flex items-center justify-between gap-2 px-2 py-2 shrink-0 cursor-grab active:cursor-grabbing select-none"
        onMouseDown={onTitleBarMouseDown}
      >
        <span className="text-sm font-medium truncate font-martian-mono text-[#7E4661]">Settings</span>
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="w-4 h-4 rounded-full bg-[#FED7AF] border-2 border-[#7E4661]" />
          <div className="w-4 h-4 rounded-full bg-[#AFD78D] border-2 border-[#7E4661]" />
          <div className="w-4 h-4 rounded-full bg-[#F8A8C4] border-2 border-[#7E4661] cursor-pointer" onClick={onClose} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onClose()} />
        </div>
      </div>
      <div className="p-4 bg-white rounded-b-xl overflow-auto">
        <div className="grid grid-cols-3 gap-4">
          {BAR_ICON_OPTIONS.map((filename) => {
            const isSelected = selectedIcon === filename
            return (
              <button
                key={filename}
                type="button"
                onClick={() => onSelect(filename)}
                className={`hover:bg-black/5 flex flex-col items-center p-1 rounded-xl border-2 transition-colors ${isSelected ? 'bg-[#7E4661]/10' : 'border-transparent hover:bg-gray-50'}`}
              >
                <img src={`/image/icons/${filename}`} alt="" className="w-14 h-14 object-contain" />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function TrashWindow({
  onClose,
  onTitleBarMouseDown,
}: {
  onClose: () => void
  onTitleBarMouseDown?: (e: React.MouseEvent) => void
}) {
  return (
    <div className="rounded-2xl overflow-hidden shadow-2xl flex flex-col bg-[#CDC7F3] p-2 pt-0 border-[3px] border-[#7E4661] min-w-[320px] max-w-[90vw] max-h-[85vh]">
      <div
        className="flex items-center justify-between gap-2 px-2 py-2 shrink-0 cursor-grab active:cursor-grabbing select-none"
        onMouseDown={onTitleBarMouseDown}
      >
        <span className="text-sm font-medium truncate font-martian-mono text-[#7E4661]">Trash</span>
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="w-4 h-4 rounded-full bg-[#FED7AF] border-2 border-[#7E4661]" />
          <div className="w-4 h-4 rounded-full bg-[#AFD78D] border-2 border-[#7E4661]" />
          <div className="w-4 h-4 rounded-full bg-[#F8A8C4] border-2 border-[#7E4661] cursor-pointer" onClick={onClose} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onClose()} />
        </div>
      </div>
      <div className="p-6 bg-white rounded-b-xl overflow-auto flex flex-col items-center justify-center min-h-[200px]">
        <p className="font-martian-mono text-sm text-[#7E4661]/80">Trash is empty</p>
      </div>
    </div>
  )
}

function MailWindow({
  onClose,
  onTitleBarMouseDown,
}: {
  onClose: () => void
  onTitleBarMouseDown?: (e: React.MouseEvent) => void
}) {
  return (
    <div className="rounded-2xl overflow-hidden shadow-2xl flex flex-col bg-[#CDC7F3] p-2 pt-0 border-[3px] border-[#7E4661] min-w-[320px] max-w-[90vw] max-h-[85vh]">
      <div
        className="flex items-center justify-between gap-2 px-2 py-2 shrink-0 cursor-grab active:cursor-grabbing select-none"
        onMouseDown={onTitleBarMouseDown}
      >
        <span className="text-sm font-medium truncate font-martian-mono text-[#7E4661]">Mail</span>
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="w-4 h-4 rounded-full bg-[#FED7AF] border-2 border-[#7E4661]" />
          <div className="w-4 h-4 rounded-full bg-[#AFD78D] border-2 border-[#7E4661]" />
          <div className="w-4 h-4 rounded-full bg-[#F8A8C4] border-2 border-[#7E4661] cursor-pointer" onClick={onClose} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onClose()} />
        </div>
      </div>
      <div className="p-6 bg-white rounded-b-xl overflow-auto flex flex-col items-center justify-center min-h-[200px]">
        <p className="font-martian-mono text-sm text-[#7E4661]/80">Contact me at <a href="mailto:eucal@gmail.com" className="underline text-[#7E4661]">eucal@gmail.com</a></p>
      </div>
    </div>
  )
}

type GridIcon = {
  id: string
  row: number
  col: number
  label: string
  imgSrc: string
  /** Optional thumbnail; when omitted, the icon shows the default folder image */
  thumbnail?: string
}

const WINDOW_Z_BASE = 30

type WindowSize = 'default' | 'fullscreen'

type OpenWindow =
  | { id: string; type: 'folder'; x: number; y: number; folderIcon: GridIcon; size?: WindowSize }
  | { id: string; type: 'settings'; x: number; y: number }
  | { id: string; type: 'trash'; x: number; y: number }
  | { id: string; type: 'mail'; x: number; y: number }

let nextWindowId = 0
function generateWindowId() {
  return `win-${++nextWindowId}`
}

/** Returns position so the window is centered horizontally (and vertically) on the screen. */
function getCenteredWindowPosition(type: OpenWindow['type'], size?: WindowSize): { x: number; y: number } {
  const padding = WINDOW_PADDING
  let w: number, h: number
  if (type === 'settings' || type === 'trash' || type === 'mail') {
    w = 360
    h = 420
  } else if (size === 'fullscreen') {
    w = getFolderWindowWidthPx()
    h = window.innerHeight - padding * 2 - BOTTOM_BAR_HEIGHT
  } else {
    w = 500
    h = 384
  }
  return {
    x: isMobileViewport() && size === 'fullscreen' ? 0 : Math.max(0, (window.innerWidth - w) / 2),
    y: Math.max(0, (window.innerHeight - h) / 2),
  }
}

/** Rightmost column index (0-based). Folder icons use the column left of this. */
function getRightmostCol(gridCols: number) {
  return Math.max(0, gridCols - 1)
}

function getInitialIcons(gridCols: number): GridIcon[] {
  const rightmostCol = getRightmostCol(gridCols)
  return [
    { id: '1', row: 0, col: 0, label: 'me', imgSrc: 'https://i.ibb.co/qM6V02Vs/image.png', thumbnail: '/image/icons/me.png' },
    { id: '4', row: 1, col: 0, label: 'CV', imgSrc: 'https://i.ibb.co/qM6V02Vs/image.png', thumbnail: '/image/icons/cv.png' },
    { id: '2', row: 2, col: 0, label: 'Mail', imgSrc: 'https://i.ibb.co/qM6V02Vs/image.png', thumbnail: '/image/icons/mail.png' },
    { id: '3', row: 3, col: 0, label: 'Settings', imgSrc: 'https://i.ibb.co/qM6V02Vs/image.png', thumbnail: '/image/icons/settings.png' },
    { id: '4', row: 4, col: 0, label: 'Trash', imgSrc: 'https://i.ibb.co/qM6V02Vs/image.png', thumbnail: '/image/icons/trash.png' },
    { id: '5', row: 0, col: rightmostCol, label: '2019 - 2022 ​Portfolios', imgSrc: DEFAULT_FOLDER_ICON },
    { id: '6', row: 1, col: rightmostCol, label: 'Curriculum by myself', imgSrc: DEFAULT_FOLDER_ICON },
    { id: '7', row: 2, col: rightmostCol, label: 'School-based Curriculum', imgSrc: DEFAULT_FOLDER_ICON },
    { id: '8', row: 3, col: rightmostCol, label: '2018 Portfolios', imgSrc: DEFAULT_FOLDER_ICON },
    { id: '9', row: 4, col: rightmostCol, label: '2017 Portfolios', imgSrc: DEFAULT_FOLDER_ICON },
    { id: '10', row: 5, col: rightmostCol, label: 'Art Practice', imgSrc: DEFAULT_FOLDER_ICON },
    { id: '11', row: 0, col: rightmostCol -1, label: 'Today Art Museum', imgSrc: DEFAULT_FOLDER_ICON },
    { id: '12', row: 1, col: rightmostCol -1, label: 'Urban Exploration', imgSrc: DEFAULT_FOLDER_ICON },
    { id: '13', row: 2, col: rightmostCol -1, label: 'Project 1', imgSrc: DEFAULT_FOLDER_ICON },
    { id: '14', row: 3, col: rightmostCol -1, label: 'Exhibition Sharing', imgSrc: DEFAULT_FOLDER_ICON },
    { id: '15', row: 4, col: rightmostCol -1, label: 'Independent Studies', imgSrc: DEFAULT_FOLDER_ICON },
    { id: '16', row: 5, col: rightmostCol -1, label: 'Travel Photography', imgSrc: PLAY_FOLDER_ICON },
  ]
}

function Icon({
  icon,
  onDragStart,
  onDragEnd,
  onClick,
}: {
  icon: GridIcon
  onDragStart: (e: React.DragEvent, icon: GridIcon) => void
  onDragEnd: (e: React.DragEvent) => void
  onClick?: (icon: GridIcon) => void
}) {
  const didDragRef = useRef(false)

  const handleClick = () => {
    if (didDragRef.current) {
      didDragRef.current = false
      return
    }
    onClick?.(icon)
  }

  const handleDragStart = (e: React.DragEvent) => {
    didDragRef.current = true
    onDragStart(e, icon)
  }

  const iconSrc = icon.thumbnail ?? icon.imgSrc

  return (
    <div
      className="grid-icon cursor-grab active:cursor-grabbing"
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      onClick={handleClick}
    >
      <img src={iconSrc} alt="" className="w-16 h-16 object-contain pointer-events-none select-none" draggable={false} />
      <p className="text-sm mt-1 pointer-events-none select-none">{icon.label}</p>
    </div>
  )
}

function App() {
  const [gridSize, setGridSize] = useState(() => getGridDimensions())
  const [icons, setIcons] = useState<GridIcon[]>(() => getInitialIcons(getGridDimensions().cols))
  const [windows, setWindows] = useState<OpenWindow[]>([])
  const [folderCollections, setFolderCollections] = useState<FoldersData | null>(null)
  const [focusedWindowId, setFocusedWindowId] = useState<string | null>(null)
  const [selectedBarIcon, setSelectedBarIcon] = useState<string>(BAR_ICON_OPTIONS[0])
  const [drag, setDrag] = useState<{ windowId: string; offsetX: number; offsetY: number } | null>(null)

  useEffect(() => {
    fetch('/data/folders.json')
      .then((res) => res.json())
      .then((data: FoldersData) => setFolderCollections(data))
      .catch(() => {})
  }, [])

  const addWindow = (w: OpenWindow) => {
    setWindows((prev) => [...prev, w])
    setFocusedWindowId(w.id)
  }

  const closeWindow = (id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id))
  }

  useEffect(() => {
    const ids = new Set(windows.map((w) => w.id))
    if (focusedWindowId !== null && !ids.has(focusedWindowId)) {
      setFocusedWindowId(windows.length > 0 ? windows[windows.length - 1].id : null)
    }
  }, [windows, focusedWindowId])

  const focusWindow = (id: string) => {
    setFocusedWindowId(id)
  }

  const findExistingWindow = (clickedIcon: GridIcon): OpenWindow | undefined => {
    if (clickedIcon.label === 'Settings') {
      return windows.find((w) => w.type === 'settings')
    }
    if (clickedIcon.label === 'Trash') {
      return windows.find((w) => w.type === 'trash')
    }
    if (clickedIcon.label === 'Mail') {
      return windows.find((w) => w.type === 'mail')
    }
    return windows.find((w) => w.type === 'folder' && w.folderIcon.id === clickedIcon.id)
  }

  useEffect(() => {
    if (!drag) return
    const onMove = (e: MouseEvent) => {
      setWindows((prev) =>
        prev.map((w) => {
          if (w.id !== drag.windowId) return w
          return {
            ...w,
            x: e.clientX - drag.offsetX,
            y: e.clientY - drag.offsetY,
          }
        })
      )
    }
    const onUp = () => setDrag(null)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [drag])

  useEffect(() => {
    const onResize = () => setGridSize(getGridDimensions())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const { cols: gridCols, rows: gridRows } = gridSize

  const getIconAt = (row: number, col: number) => icons.find((i) => i.row === row && i.col === col)

  const handleIconDragStart = (e: React.DragEvent, icon: GridIcon) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('application/json', JSON.stringify({ id: icon.id, fromRow: icon.row, fromCol: icon.col }))
    ;(e.currentTarget as HTMLElement).classList.add('opacity-50')
  }

  const handleIconDragEnd = (e: React.DragEvent) => {
    ;(e.currentTarget as HTMLElement).classList.remove('opacity-50')
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, toRow: number, toCol: number) => {
    e.preventDefault()
    const raw = e.dataTransfer.getData('application/json')
    if (!raw) return
    const { id, fromRow, fromCol } = JSON.parse(raw) as { id: string; fromRow: number; fromCol: number }
    if (fromRow === toRow && fromCol === toCol) return

    setIcons((prev) => {
      const moved = prev.find((i) => i.id === id)
      const occupant = prev.find((i) => i.row === toRow && i.col === toCol)
      if (!moved) return prev
      return prev.map((icon) => {
        if (icon.id === id) return { ...icon, row: toRow, col: toCol }
        if (occupant && icon.id === occupant.id) return { ...icon, row: fromRow, col: fromCol }
        return icon
      })
    })
  }

  return (
    <div className="relative p-0">
      <img
        src="/image/background.png"
        className="fixed top-0 left-0 w-screen h-screen object-cover -z-10"
        alt=""
      />

      {/* Window layer: taskbar order = array order; focused window is on top via z-index */}
      {windows.map((win, index) => (
        <div
          key={win.id}
          className="fixed pointer-events-none"
          style={{ left: 0, top: 0, right: 0, bottom: 0, zIndex: WINDOW_Z_BASE + (win.id === focusedWindowId ? windows.length : index) }}
        >
          <div
            className="absolute pointer-events-auto"
            style={{ left: win.x, top: win.y }}
            onClick={() => focusWindow(win.id)}
          >
            {win.type === 'folder' && (
              <FolderWindow
                title={win.folderIcon.label}
                onClose={() => closeWindow(win.id)}
                onTitleBarMouseDown={(e) => {
                  e.preventDefault()
                  focusWindow(win.id)
                  setDrag({
                    windowId: win.id,
                    offsetX: e.clientX - win.x,
                    offsetY: e.clientY - win.y,
                  })
                }}
                size={win.size}
                folderCollection={folderCollections?.folders.find((f) => f.label === win.folderIcon.label)}
                contentAlign={(win.folderIcon.label === 'me' || win.folderIcon.label === 'CV' || win.folderIcon.label === 'Resume') ? 'left' : 'center'}
                children={(win.folderIcon.label === 'me' || win.folderIcon.label === 'CV' || win.folderIcon.label === 'Resume') ? (
                  <pre className="font-martian-mono text-sm text-[#7E4661] whitespace-pre-wrap m-0 leading-relaxed">
                    {RESUME_TEXT}
                  </pre>
                ) : undefined}
              />
            )}
            {win.type === 'mail' && (
              <MailWindow
                onClose={() => closeWindow(win.id)}
                onTitleBarMouseDown={(e) => {
                  e.preventDefault()
                  focusWindow(win.id)
                  setDrag({
                    windowId: win.id,
                    offsetX: e.clientX - win.x,
                    offsetY: e.clientY - win.y,
                  })
                }}
              />
            )}
            {win.type === 'trash' && (
              <TrashWindow
                onClose={() => closeWindow(win.id)}
                onTitleBarMouseDown={(e) => {
                  e.preventDefault()
                  focusWindow(win.id)
                  setDrag({
                    windowId: win.id,
                    offsetX: e.clientX - win.x,
                    offsetY: e.clientY - win.y,
                  })
                }}
              />
            )}
            {win.type === 'settings' && (
              <SettingsWindow
                selectedIcon={selectedBarIcon}
                onSelect={setSelectedBarIcon}
                onClose={() => closeWindow(win.id)}
                onTitleBarMouseDown={(e) => {
                  e.preventDefault()
                  focusWindow(win.id)
                  setDrag({
                    windowId: win.id,
                    offsetX: e.clientX - win.x,
                    offsetY: e.clientY - win.y,
                  })
                }}
              />
            )}
          </div>
        </div>
      ))}

      <div className="relative z-20 w-screen h-screen p-4 box-border">
        <div
          className="grid gap-2 mx-auto w-fit"
          style={{
            gridTemplateColumns: `repeat(${gridCols}, 5rem)`,
            gridTemplateRows: `repeat(${gridRows}, 5.5rem)`,
          }}
        >
          {Array.from({ length: gridRows }, (_, row) =>
            Array.from({ length: gridCols }, (_, col) => {
              const icon = getIconAt(row, col)
              const key = `cell-${row}-${col}`
              if (icon) {
                return (
                  <div key={key} className="grid-cell flex items-start justify-center pt-1">
                    <Icon
                      icon={icon}
                      onDragStart={handleIconDragStart}
                      onDragEnd={handleIconDragEnd}
                      onClick={(clickedIcon) => {
                      const existing = findExistingWindow(clickedIcon)
                      if (existing) {
                        focusWindow(existing.id)
                        return
                      }
                      if (clickedIcon.label === 'Settings') {
                        const pos = getCenteredWindowPosition('settings')
                        addWindow({
                          id: generateWindowId(),
                          type: 'settings',
                          x: pos.x,
                          y: pos.y,
                        })
                      } else if (clickedIcon.label === 'Trash') {
                        const pos = getCenteredWindowPosition('trash')
                        addWindow({
                          id: generateWindowId(),
                          type: 'trash',
                          x: pos.x,
                          y: pos.y,
                        })
                      } else if (clickedIcon.label === 'Mail') {
                        const pos = getCenteredWindowPosition('mail')
                        addWindow({
                          id: generateWindowId(),
                          type: 'mail',
                          x: pos.x,
                          y: pos.y,
                        })
                      } else {
                        const pos = getCenteredWindowPosition('folder', 'fullscreen')
                        addWindow({
                          id: generateWindowId(),
                          type: 'folder',
                          x: pos.x,
                          y: pos.y,
                          folderIcon: clickedIcon,
                          size: 'fullscreen',
                        })
                      }
                    }}
                    />
                  </div>
                )
              }
              return (
                <div
                  key={key}
                  className="grid-cell grid-cell-empty w-[5rem] h-[5.5rem] rounded border-2 border-transparent border-dashed hover:border-white/30"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, row, col)}
                />
              )
            })
          ).flat()}
        </div>
      </div>
      {/* Bottom bar: left pink + right teal, top border */}
      <div className="fixed bottom-0 left-0 w-screen h-12 flex items-stretch border-t-[3px] border-[#7E4661] z-20">
        <div className="flex items-center gap-2 pl-3 pr-4 min-w-0 shrink-0" style={{ background: '#E8C4C4', borderRight: '2px solid #7E4661' }}>
          <img src={`/image/icons/${selectedBarIcon}`} alt="" className="w-8 h-8 object-contain" />
          <span className="font-medium text-[#7E4661] truncate font-martian-mono">Eucal.me</span>
        </div>
        <div className="flex-1 flex items-center justify-between gap-4 pl-4 pr-4 min-w-0 bg-[#B0E8DB]">
          <div className="flex items-center gap-2 shrink-0">
            {windows.map((win) => {
              const isFocused = win.id === focusedWindowId
              return (
              <button
                key={win.id}
                type="button"
                onClick={() => focusWindow(win.id)}
                className={`flex items-center justify-center w-9 h-9 rounded-xl transition-colors p-1 ${isFocused ? 'bg-[#7E4661]/15' : 'hover:bg-[#7E4661]/10'}`}
                title={win.type === 'folder' ? win.folderIcon.label : win.type === 'trash' ? 'Trash' : 'Settings'}
              >
                {win.type === 'folder' ? (
                  <img
                    src={(win.folderIcon.thumbnail ?? win.folderIcon.imgSrc)}
                    alt=""
                    className="w-full h-full object-contain"
                  />
                ) : win.type === 'trash' ? (
                  <img src="/image/icons/trash.png" alt="" className="w-full h-full object-contain" />
                ) : (
                  <img src="/image/icons/settings.png" alt="" className="w-full h-full object-contain" />
                )}
              </button>
            )})}
          </div>
          <div className="flex items-center gap-3 shrink-0 text-[#7E4661]">
            <span className="text-sm font-medium">ENG</span>
            <svg className="w-5 h-5 shrink-0" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48">
              <path fill="currentColor" d="M17.5 3.5c1.37 0 2.627.512 3.542 1.458c.915.947 1.458 2.299 1.458 3.93c0 1.623-.536 3.252-1.41 4.485c-.87 1.227-2.13 2.127-3.59 2.127s-2.72-.9-3.59-2.127c-.874-1.233-1.41-2.862-1.41-4.484c0-1.632.543-2.984 1.459-3.931C14.873 4.012 16.13 3.5 17.5 3.5m-11 9c1.37 0 2.627.512 3.542 1.458c.915.947 1.458 2.299 1.458 3.93c0 1.623-.536 3.252-1.41 4.485C9.22 23.6 7.96 24.5 6.5 24.5s-2.72-.9-3.59-2.127C2.036 21.14 1.5 19.51 1.5 17.889c0-1.632.543-2.984 1.459-3.931C3.873 13.012 5.13 12.5 6.5 12.5m17.5 7c-7.124 0-13.026 6.065-14.884 13.67c-.824 3.374.433 6.993 3.533 8.708c2.463 1.364 6.149 2.622 11.35 2.622c5.202 0 8.888-1.258 11.352-2.622c3.099-1.715 4.356-5.334 3.532-8.707C37.026 25.565 31.123 19.5 24 19.5m17.5-7c-1.37 0-2.627.512-3.541 1.458c-.916.947-1.459 2.299-1.459 3.93c0 1.623.536 3.252 1.41 4.485c.87 1.227 2.13 2.127 3.59 2.127s2.72-.9 3.59-2.127c.874-1.233 1.41-2.862 1.41-4.484c0-1.632-.543-2.984-1.458-3.931c-.915-.946-2.172-1.458-3.542-1.458m-11-9c-1.37 0-2.627.512-3.541 1.458c-.916.947-1.459 2.299-1.459 3.93c0 1.623.536 3.252 1.41 4.485c.87 1.227 2.13 2.127 3.59 2.127s2.72-.9 3.59-2.127c.874-1.233 1.41-2.862 1.41-4.484c0-1.632-.543-2.984-1.458-3.931C33.127 4.012 31.87 3.5 30.5 3.5"></path>
            </svg>
            <svg className="w-5 h-5 shrink-0" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
              <path fill="currentColor" d="M2.06 10.06c.51.51 1.32.56 1.87.1c4.67-3.84 11.45-3.84 16.13-.01c.56.46 1.38.42 1.89-.09c.59-.59.55-1.57-.1-2.1c-5.71-4.67-13.97-4.67-19.69 0c-.65.52-.7 1.5-.1 2.1m7.76 7.76l1.47 1.47c.39.39 1.02.39 1.41 0l1.47-1.47c.47-.47.37-1.28-.23-1.59a4.28 4.28 0 0 0-3.91 0c-.57.31-.68 1.12-.21 1.59m-3.73-3.73c.49.49 1.26.54 1.83.13a7.06 7.06 0 0 1 8.16 0c.57.4 1.34.36 1.83-.13l.01-.01c.6-.6.56-1.62-.13-2.11c-3.44-2.49-8.13-2.49-11.58 0c-.69.5-.73 1.51-.12 2.12"></path>
            </svg>
            <svg className="w-5 h-5 shrink-0" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
              <path fill="currentColor" fillRule="evenodd" d="M14.537 3.396c1.163-.767 2.713.068 2.713 1.461v14.286c0 1.394-1.55 2.228-2.713 1.461l-6-3.955a.25.25 0 0 0-.137-.042H5.5a2.75 2.75 0 0 1-2.75-2.75v-3.714a2.75 2.75 0 0 1 2.75-2.75h2.9a.25.25 0 0 0 .138-.041zM20.5 8.25a.75.75 0 0 1 .75.75v6a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75" clipRule="evenodd"></path>
            </svg>
            <span className="text-sm font-medium tabular-nums font-martian-mono font-semibold">{new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
