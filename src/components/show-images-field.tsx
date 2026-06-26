import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { Modal } from "./modal"
import { Media } from "./media"
import {
  downloadDataUrl,
  getImagePathOriginal,
  hideWaiting,
  showWaiting,
  uploadMediaReturnId,
} from "./utility"
import { MediaData, ShowPicture } from "../interfaces"

const closeIcon = "/images/closeicon.svg"
const addIcon = "/images/upload.svg"
const pickIcon = "/images/choose.svg"
const pendingImg = "/images/cog.svg"

type Item = {
  id: string
  url?: string
  preview: string | null
  loading: boolean
}

interface ShowImagesFieldProps {
  initial?: ShowPicture[]
  onChange: (pictureIds: string[]) => void
}

export const ShowImagesField = (props: ShowImagesFieldProps) => {
  const { t } = useTranslation()
  const [items, setItems] = useState<Item[]>([])
  const [showLibrary, setShowLibrary] = useState(false)
  const [zoomPreview, setZoomPreview] = useState<string | null>(null)
  const initialApplied = useRef(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (initialApplied.current) return
    if (!props.initial || props.initial.length === 0) return
    initialApplied.current = true
    const seeded = props.initial.map((p) => ({
      id: String(p._id),
      url: p.url,
      preview: null,
      loading: true,
    }))
    setItems(seeded)
    seeded.forEach((it) => {
      if (!it.url) {
        setItems((prev) =>
          prev.map((x) => (x.id === it.id ? { ...x, loading: false } : x)),
        )
        return
      }
      getImagePathOriginal(it.url).then((b64) => {
        setItems((prev) =>
          prev.map((x) =>
            x.id === it.id
              ? {
                  ...x,
                  preview: b64 ? `data:image/png;base64,${b64}` : null,
                  loading: false,
                }
              : x,
          ),
        )
      })
    })
  }, [props.initial])

  const emit = (next: Item[]) => {
    props.onChange(next.map((it) => it.id))
  }

  const addFromFile = async (file: File) => {
    showWaiting()
    const id = await uploadMediaReturnId(file)
    hideWaiting()
    if (!id) return
    const reader = new FileReader()
    reader.onload = () => {
      setItems((prev) => {
        const next: Item[] = [
          ...prev,
          {
            id,
            preview: typeof reader.result === "string" ? reader.result : null,
            loading: false,
          },
        ]
        emit(next)
        return next
      })
    }
    reader.readAsDataURL(file)
  }

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0]
    if (file) {
      void addFromFile(file)
    }
    e.target.value = ""
  }

  const addFromLibrary = (data: MediaData) => {
    setShowLibrary(false)
    setItems((prev) => {
      if (prev.some((it) => it.id === data.id)) return prev
      const newItem: Item = {
        id: data.id,
        url: data.url,
        preview: data.img ? `data:image/png;base64,${data.img}` : null,
        loading: !data.img,
      }
      const next = [...prev, newItem]
      emit(next)
      if (!data.img && data.url) {
        getImagePathOriginal(data.url).then((b64) => {
          setItems((curr) =>
            curr.map((x) =>
              x.id === data.id
                ? {
                    ...x,
                    preview: b64 ? `data:image/png;base64,${b64}` : null,
                    loading: false,
                  }
                : x,
            ),
          )
        })
      }
      return next
    })
  }

  const removeItem = (id: string) => {
    setItems((prev) => {
      const next = prev.filter((it) => it.id !== id)
      emit(next)
      return next
    })
  }

  return (
    <div className="showImagesField">
      <div className="showImagesHeader">
        <p className="strong">{t("general.showimages")}</p>
        <div className="showImagesActions">
          <button
            type="button"
            className="secondaryButton"
            onClick={() => setShowLibrary(true)}
          >
            <img src={pickIcon} className="smallImageW" />
            {t("general.selectlibrary")}
          </button>
          <button
            type="button"
            className="primaryButton"
            onClick={() => fileInputRef.current?.click()}
          >
            <img src={addIcon} className="smallImageW" />
            {t("general.add")}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg"
            style={{ display: "none" }}
            onChange={onFileInputChange}
          />
        </div>
      </div>

      {items.length === 0 ? (
        <p className="smallerText showImagesEmpty">
          {t("general.showimages_empty")}
        </p>
      ) : (
        <div className="showImagesGrid">
          {items.map((it) => (
            <div key={it.id} className="showImagesCell">
              {it.preview ? (
                <img
                  className="showImagesThumb zoom"
                  src={it.preview}
                  onClick={() => setZoomPreview(it.preview)}
                />
              ) : it.loading ? (
                <div className="showImagesPlaceholder">
                  <img className="smallImageW rotate" src={pendingImg} />
                </div>
              ) : (
                <div className="showImagesPlaceholder" />
              )}
              <button
                type="button"
                className="showImagesRemove"
                aria-label={t("general.remove")}
                onClick={(e) => {
                  e.stopPropagation()
                  removeItem(it.id)
                }}
              >
                <img src={closeIcon} className="smallImageW" />
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal
        title={t("general.selectlibrary")}
        closeicon=""
        visible={showLibrary}
        onClose={() => setShowLibrary(false)}
      >
        <section className="scrollable">
          <Media onSelect={(data) => addFromLibrary(data)} />
        </section>
      </Modal>

      <Modal
        title=""
        closeicon=""
        visible={zoomPreview !== null}
        onClose={() => setZoomPreview(null)}
      >
        {zoomPreview && (
          <>
            <img className="fit" src={zoomPreview} />
            <div className="buttonblock">
              <button className="primaryButton" onClick={() => downloadDataUrl(zoomPreview, "image.png")}>
                {t("general.download")}
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  )
}
