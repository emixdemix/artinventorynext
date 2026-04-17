import { useContext, useEffect, useState } from "react";
import {
  ArtPiece,
  ArtPieceDAO,
  ArtSelection,
  Category,
  KeyValue,
} from "../../interfaces";
import { useTranslation } from "react-i18next";
import {
  addCategory,
  apiGetCustomer,
  apiGetShow,
  apiSaveCustomer,
  apiSaveShow,
  deleteCategory,
  doAutoLogin,
  doChangePassword,
  doLogin,
  doRegister,
  doReset,
  doSendLink,
  getCategories,
  GetImage,
  getImagePathOriginal,
  getSelections,
  hideWaiting,
  isValidEmail,
  showWaiting,
} from "../utility";
import { FileUploader } from "react-drag-drop-files";
const uploadimage = "/images/upload.svg";
const pendingimage = "/images/cog.svg";
const pick = "/images/choose.svg";
const empty = "/images/nothing.svg";
const close = "/images/closeicon.svg";
const searchIcon = "/images/search.svg";
const eyeopen = "/images/openeye.svg";
const eyeclose = "/images/closeeye.svg";
const email = "/images/email.svg";

import { Media } from "../media";
import Select, { MultiValue, SingleValue } from "react-select";
const remove = "/images/trash.svg";
import { useRouter, useParams } from "next/navigation";
import { Modal } from "../modal";
import { load } from "recaptcha-v3";
import { AxiosResponse } from "axios";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import { Dayjs } from "dayjs";
import ReactGA from "react-ga4";

import useDownloader from "react-use-downloader";
import { Calculator } from "../calculator";
import Grid2 from "@mui/material/Grid2/Grid2";
import { ContextStorage } from "../../store";

interface AddArtpieceProps {
  onClose: () => void;
  onSave: (form: ArtPieceDAO) => void;
  error: string;
}

interface EditArtpieceProps {
  onClose: () => void;
  onSave: (form: ArtPieceDAO) => void;
  artpiece: ArtPiece;
  error: string;
  categories: Category[];
}

interface AddShowProps {}

interface AddCustomerProps {}

interface EditCustomerProps {
  id: string;
}
interface EditShowProps {
  id: string;
}

export const AddCustomerForm = (props: AddCustomerProps) => {
  const [values, setValues] = useState({} as KeyValue);
  const [error, setError] = useState("");
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {}, []);

  const setValueField = (text: string, name: string) => {
    values[name] = text;
    setValues({ ...values });
  };

  const checkFields = () => {
    if (values["name"]) {
      return false;
    }
    return true;
  };

  const saveCustomer = async () => {
    showWaiting();
    const response = await apiSaveCustomer(values);
    if (response.error === false) {
      hideWaiting();
      router.push("/customers");
      return;
    } else {
      setError(t("general.error"));
    }
    hideWaiting();
  };

  return (
    <>
      <section className="form">
        <div className="inputfield">
          <label>{t("general.showname")}*</label>
          <input
            placeholder={t("general.placeholders.showname")}
            type="text"
            name="name"
            value={values["name"]}
            onChange={(e) => setValueField(e.target.value, "name")}
          />
        </div>
        <div className="inputfield">
          <label>{t("general.showdescription")}</label>
          <input
            placeholder={t("general.placeholders.description")}
            type="text"
            name="description"
            value={values["description"]}
            onChange={(e) => setValueField(e.target.value, "description")}
          />
        </div>

        <div className="inputfield">
          <label>{t("general.showemail")}</label>
          <input
            placeholder={t("general.placeholders.email")}
            type="text"
            name="email"
            value={values["email"]}
            onChange={(e) => setValueField(e.target.value, "email")}
          />
        </div>
        <div className="addressblock">
          <div>{t("general.showlocation")}</div>
          <div className="fields">
            <div className="inputfield">
              <label>{t("general.showaddress")}</label>
              <input
                placeholder={t("general.placeholders.address")}
                type="text"
                name="address"
                value={values["address"]}
                onChange={(e) => setValueField(e.target.value, "address")}
              />
            </div>
            <div className="inputfield">
              <label>{t("general.showcity")}</label>
              <input
                placeholder={t("general.placeholders.city")}
                type="text"
                name="city"
                value={values["city"]}
                onChange={(e) => setValueField(e.target.value, "city")}
              />
            </div>
            <div className="inputfield">
              <label>{t("general.showstate")}</label>
              <input
                placeholder={t("general.placeholders.state")}
                type="text"
                name="state"
                value={values["state"]}
                onChange={(e) => setValueField(e.target.value, "state")}
              />
            </div>
            <div className="inputfield">
              <label>{t("general.showcountry")}</label>
              <input
                placeholder={t("general.placeholders.country")}
                type="text"
                name="country"
                value={values["country"]}
                onChange={(e) => setValueField(e.target.value, "country")}
              />
            </div>
          </div>
          <div>&nbsp;</div>
        </div>

        {error && <p className="error">{error}</p>}

        <div className="buttonblock">
          <button
            disabled={checkFields()}
            className="primaryButton"
            onClick={() => {
              saveCustomer();
            }}
          >
            {t("general.save")}
          </button>
        </div>
      </section>
    </>
  );
};

export const EditCustomerForm = (props: EditCustomerProps) => {
  const [values, setValues] = useState({} as KeyValue);
  const [error, setError] = useState("");
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    apiGetCustomer(props.id).then((data) => {
      if (!data.error) {
        const v = {} as KeyValue;
        v["_id"] = data.response.data._id;
        v["name"] = data.response.data.name;
        v["address"] = data.response.data.location.street;
        v["city"] = data.response.data.location.city;
        v["state"] = data.response.data.location.state;
        v["country"] = data.response.data.location.country;
        v["description"] = data.response.data.description;
        v["email"] = data.response.data.email;
        setValues(v);
      }
    });
  }, [props.id]);

  const setValueField = (text: string, name: string) => {
    values[name] = text;
    setValues({ ...values });
  };

  const checkFields = () => {
    if (values["name"]) {
      return false;
    }
    return true;
  };

  const saveCustomer = async () => {
    showWaiting();
    const response = await apiSaveCustomer(values);
    if (response.error === false) {
      hideWaiting();
      router.push("/customers");
      return;
    } else {
      setError(t("general.error"));
    }
    hideWaiting();
  };

  return (
    <>
      <section className="form">
        <div className="inputfield">
          <label>{t("general.showname")}*</label>
          <input
            placeholder={t("general.placeholders.showname")}
            type="text"
            name="name"
            value={values["name"]}
            onChange={(e) => setValueField(e.target.value, "name")}
          />
        </div>
        <div className="inputfield">
          <label>{t("general.showdescription")}</label>
          <input
            placeholder={t("general.placeholders.description")}
            type="text"
            name="description"
            value={values["description"]}
            onChange={(e) => setValueField(e.target.value, "description")}
          />
        </div>

        <div className="inputfield">
          <label>{t("general.showemail")}</label>
          <input
            placeholder={t("general.placeholders.email")}
            type="text"
            name="email"
            value={values["email"]}
            onChange={(e) => setValueField(e.target.value, "email")}
          />
        </div>
        <div className="addressblock">
          <div>{t("general.showlocation")}</div>
          <div className="fields">
            <div className="inputfield">
              <label>{t("general.showaddress")}</label>
              <input
                placeholder={t("general.placeholders.address")}
                type="text"
                name="address"
                value={values["address"]}
                onChange={(e) => setValueField(e.target.value, "address")}
              />
            </div>
            <div className="inputfield">
              <label>{t("general.showcity")}</label>
              <input
                placeholder={t("general.placeholders.city")}
                type="text"
                name="city"
                value={values["city"]}
                onChange={(e) => setValueField(e.target.value, "city")}
              />
            </div>
            <div className="inputfield">
              <label>{t("general.showstate")}</label>
              <input
                placeholder={t("general.placeholders.state")}
                type="text"
                name="state"
                value={values["state"]}
                onChange={(e) => setValueField(e.target.value, "state")}
              />
            </div>
            <div className="inputfield">
              <label>{t("general.showcountry")}</label>
              <input
                placeholder={t("general.placeholders.country")}
                type="text"
                name="country"
                value={values["country"]}
                onChange={(e) => setValueField(e.target.value, "country")}
              />
            </div>
          </div>
          <div>&nbsp;</div>
        </div>

        {error && <p className="error">{error}</p>}

        <div className="buttonblock">
          <button
            disabled={checkFields()}
            className="primaryButton"
            onClick={() => {
              saveCustomer();
            }}
          >
            {t("general.save")}
          </button>
        </div>
      </section>
    </>
  );
};

export const AddShowForm = (props: AddShowProps) => {
  const [values, setValues] = useState({} as KeyValue);
  const [error, setError] = useState("");
  const [selections, setSelections] = useState([] as ArtSelection[]);
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    getSelections().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setSelections(data);
      } else {
        setSelections([]);
      }
    });
  }, []);

  const setValueField = (text: string, name: string) => {
    values[name] = text;
    setValues({ ...values });
  };

  const checkFields = () => {
    if (values["name"]) {
      return false;
    }
    return true;
  };

  const saveShow = async () => {
    showWaiting();
    const response = await apiSaveShow(values);
    if (response.error === false) {
      hideWaiting();
      router.push("/shows");
      return;
    } else {
      setError(t("general.error"));
    }
    hideWaiting();
  };

  return (
    <>
      <section className="form">
        <div className="inputfield">
          <label>{t("general.showname")}*</label>
          <input
            placeholder={t("general.placeholders.showname")}
            type="text"
            name="name"
            value={values["name"]}
            onChange={(e) => setValueField(e.target.value, "name")}
          />
        </div>

        <div className="inputfield">
          <label>{t("general.showlocation")}</label>
          <input
            placeholder={t("general.placeholders.location")}
            type="text"
            name="location"
            value={values["location"]}
            onChange={(e) => setValueField(e.target.value, "location")}
          />
        </div>

        <div className="inputfield">
          <label>{t("general.showbegin")}</label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer
              components={["MobileDateTimePicker", "DateTimePicker"]}
            >
              <MobileDateTimePicker
                viewRenderers={{
                  hours: renderTimeViewClock,
                  minutes: renderTimeViewClock,
                }}
                format="DD-MM-YYYY HH:mm"
                value={new AdapterDayjs().dayjs(values["begin"])}
                onChange={(v) =>
                  setValueField((v as Dayjs).toISOString(), "begin")
                }
              />
            </DemoContainer>
          </LocalizationProvider>
        </div>

        <div className="inputfield">
          <label>{t("general.showend")}</label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer
              components={["MobileDateTimePicker", "DateTimePicker"]}
            >
              <MobileDateTimePicker
                viewRenderers={{
                  hours: renderTimeViewClock,
                  minutes: renderTimeViewClock,
                }}
                format="DD-MM-YYYY HH:mm"
                value={new AdapterDayjs().dayjs(values["end"])}
                onChange={(v) =>
                  setValueField((v as Dayjs).toISOString(), "end")
                }
              />
            </DemoContainer>
          </LocalizationProvider>
        </div>

        <div className="inputfield">
          <label>{t("general.showdescription")}</label>
          <input
            placeholder={t("general.placeholders.description")}
            type="text"
            name="description"
            value={values["description"]}
            onChange={(e) => setValueField(e.target.value, "description")}
          />
        </div>

        <div className="inputfield">
          <label>{t("general.showwebsite")}</label>
          <input
            placeholder={t("general.placeholders.website")}
            type="text"
            name="website"
            value={values["website"]}
            onChange={(e) => setValueField(e.target.value, "website")}
          />
        </div>

        <div className="inputfield">
          <label>{t("general.list")}</label>
          <Select
            placeholder={t("general.select")}
            closeMenuOnSelect={true}
            isMulti={false}
            options={[
              { label: t("general.select"), value: "" },
              ...selections.map((item) => {
                return { label: item.name, value: item._id as string };
              }),
            ]}
            onChange={(e) => setValueField(e?.value as string, "list")}
          />
        </div>

        {error && <p className="error">{error}</p>}

        <div className="buttonblock">
          <button
            disabled={checkFields()}
            className="primaryButton"
            onClick={() => {
              saveShow();
            }}
          >
            {t("general.save")}
          </button>
        </div>
      </section>
    </>
  );
};

export const EditShowForm = (props: EditShowProps) => {
  const [values, setValues] = useState({} as KeyValue);
  const [error, setError] = useState("");
  const [selections, setSelections] = useState([] as ArtSelection[]);
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    getSelections().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setSelections(data);
      } else {
        setSelections([]);
      }
    });
  }, []);

  useEffect(() => {
    if (selections.length > 0)
      apiGetShow(props.id).then((data) => {
        if (!data.error) {
          const f = selections.filter(
            (item) => item._id === data.response.data.list,
          )[0];
          const v = {} as KeyValue;
          v["name"] = data.response.data.name;
          v["location"] = data.response.data.location;
          v["begin"] = data.response.data.begin;
          v["end"] = data.response.data.end;
          v["description"] = data.response.data.description;
          v["website"] = data.response.data.website;
          v["list"] = f
            ? { label: f.name, value: f._id }
            : { label: "", value: "" };
          setValues(v);
        }
      });
  }, [selections]);

  const setValueField = (text: string, name: string) => {
    values[name] = text;
    setValues({ ...values });
  };

  const setSelectValueField = (
    val: SingleValue<{ label: string; value: string }>,
    name: string,
  ) => {
    values["list"] = val;
    setValues({ ...values });
  };

  const checkFields = () => {
    if (values["name"]) {
      return false;
    }
    return true;
  };

  const saveShow = async () => {
    showWaiting();
    values["_id"] = props.id;
    values["list"] = values["list"]["value"];
    const response = await apiSaveShow(values);
    if (response.error === false) {
      hideWaiting();
      router.push("/shows");
      return;
    } else {
      setError(t("general.error"));
    }
    hideWaiting();
  };

  return (
    <>
      <section className="form">
        <div className="inputfield">
          <label>{t("general.showname")}*</label>
          <input
            placeholder={t("general.placeholders.showname")}
            type="text"
            name="name"
            value={values["name"]}
            onChange={(e) => setValueField(e.target.value, "name")}
          />
        </div>

        <div className="inputfield">
          <label>{t("general.showlocation")}</label>
          <input
            placeholder={t("general.placeholders.location")}
            type="text"
            name="location"
            value={values["location"]}
            onChange={(e) => setValueField(e.target.value, "location")}
          />
        </div>

        <div className="inputfield">
          <label>{t("general.showbegin")}</label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer
              components={["MobileDateTimePicker", "DateTimePicker"]}
            >
              <MobileDateTimePicker
                viewRenderers={{
                  hours: renderTimeViewClock,
                  minutes: renderTimeViewClock,
                }}
                format="DD-MM-YYYY HH:mm"
                value={new AdapterDayjs().dayjs(values["begin"])}
                onChange={(v) =>
                  setValueField((v as Dayjs).toISOString(), "begin")
                }
              />
            </DemoContainer>
          </LocalizationProvider>
        </div>

        <div className="inputfield">
          <label>{t("general.showend")}</label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer
              components={["MobileDateTimePicker", "DateTimePicker"]}
            >
              <MobileDateTimePicker
                viewRenderers={{
                  hours: renderTimeViewClock,
                  minutes: renderTimeViewClock,
                }}
                format="DD-MM-YYYY HH:mm"
                value={new AdapterDayjs().dayjs(values["end"])}
                onChange={(v) =>
                  setValueField((v as Dayjs).toISOString(), "end")
                }
              />
            </DemoContainer>
          </LocalizationProvider>
        </div>

        <div className="inputfield">
          <label>{t("general.showdescription")}</label>
          <input
            placeholder={t("general.placeholders.description")}
            type="text"
            name="description"
            value={values["description"]}
            onChange={(e) => setValueField(e.target.value, "description")}
          />
        </div>

        <div className="inputfield">
          <label>{t("general.showwebsite")}</label>
          <input
            placeholder={t("general.placeholders.website")}
            type="text"
            name="website"
            value={values["website"]}
            onChange={(e) => setValueField(e.target.value, "website")}
          />
        </div>

        <div className="inputfield">
          <label>{t("general.list")}</label>
          <Select
            placeholder={t("general.select")}
            closeMenuOnSelect={true}
            value={values["list"]}
            isMulti={false}
            options={selections.map((item) => {
              return { label: item.name, value: item._id as string };
            })}
            onChange={(e) => setSelectValueField(e, "list")}
          />
        </div>

        {error && <p className="error">{error}</p>}

        <div className="buttonblock">
          <button
            disabled={checkFields()}
            className="primaryButton"
            onClick={() => {
              saveShow();
            }}
          >
            {t("general.save")}
          </button>
        </div>
      </section>
    </>
  );
};

export const AddArtpiece = (props: AddArtpieceProps) => {
  const [values, setValues] = useState({} as KeyValue);
  const [files, setFiles] = useState([] as File[]);
  const [original, setOriginal] = useState("");
  const [image, setImage] = useState("");
  const [pending, setPending] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [categories, setCategoeries] = useState([] as Category[]);
  const [showCalculator, setShowCalculator] = useState(false);
  const store = useContext(ContextStorage);

  const { t } = useTranslation();

  useEffect(() => {
    getCategories("all").then((res) => {
      setCategoeries(res);
    });
  }, []);

  const setValueField = (text: string, name: string) => {
    values[name] = text;
    setValues({ ...values });
  };

  const setSelectField = (
    selections: MultiValue<Category> | SingleValue<Category>,
    name: string,
  ) => {
    values[name] = selections;
    setValues({ ...values });
  };

  const handleChange = (file: File) => {
    setFiles([file]);
  };

  const checkFields = () => {
    if (
      values["title"] &&
      (files.length > 0 || original) &&
      values["category"] &&
      values["status"] &&
      values["arttype"]
    ) {
      return false;
    }
    return true;
  };

  const saveArtPiece = () => {
    const cats = [];
    cats.push(
      ...(values["category"] as MultiValue<Category>).map((item) => item._id),
    );
    cats.push((values["status"] as SingleValue<Category>)?._id as string);
    cats.push((values["arttype"] as SingleValue<Category>)?._id as string);
    props.onSave({
      image: image || files[0],
      title: values["title"],
      dimensions: createDimensions(values["w"], values["h"], values["d"]),
      description: values["description"] || "",
      price: values["price"] || "",
      year: values["year"] || "",
      media: values["media"] || "",
      quantity: values["quantity"] ? values["quantity"].toString() : "1",
      categories: cats,
    });
  };

  const loadImage = async (id: string) => {
    setPending(true);
    getImagePathOriginal(id).then((res) => {
      setOriginal(res);
      setPending(false);
    });
  };

  const selectedImage = (data: { url: string; id: string }) => {
    setShowMediaLibrary(false);
    setFiles([]);
    setImage(data.id);
    loadImage(data.url);
  };

  return (
    <>
      <section className="form">
        <div className="inputfield">
          <label>{t("general.title")}*</label>
          <input
            placeholder={t("general.placeholders.title")}
            type="text"
            name="title"
            value={values["title"]}
            onChange={(e) => setValueField(e.target.value, "title")}
          />
        </div>
        <div className="inputfield">
          <p>{t("general.dimensions")}</p>
          <div className="dimensions">
            <label>
              {t("general.length")}
              <span>({store.profile?.measures || "cm"})</span>
            </label>
            <input
              placeholder={t("general.placeholders.height")}
              type="text"
              name="h"
              value={values["h"]}
              onChange={(e) => setValueField(e.target.value, "h")}
            />
            <label>
              {t("general.width")}
              <span>({store.profile?.measures || "cm"})</span>
            </label>
            <input
              placeholder={t("general.placeholders.width")}
              type="text"
              name="w"
              value={values["w"]}
              onChange={(e) => setValueField(e.target.value, "w")}
            />
            <label>
              {t("general.depth")}
              <span>({store.profile?.measures || "cm"})</span>
            </label>
            <input
              placeholder={t("general.placeholders.depth")}
              type="text"
              name="d"
              value={values["d"]}
              onChange={(e) => setValueField(e.target.value, "d")}
            />
          </div>
        </div>
        <div className="inputfield">
          <label>{t("general.media")}</label>
          <input
            placeholder={t("general.placeholders.media")}
            type="text"
            name="media"
            value={values["media"]}
            onChange={(e) => setValueField(e.target.value, "media")}
          />
        </div>
        <div className="inputfield">
          <label>{t("general.year")}</label>
          <input
            placeholder={t("general.placeholders.year")}
            type="text"
            name="year"
            value={values["year"]}
            onChange={(e) => setValueField(e.target.value, "year")}
          />
        </div>

        <div className="inputfield">
          <label>{t("general.description")}</label>
          <input
            placeholder={t("general.placeholders.description")}
            type="text"
            name="description"
            value={values["description"]}
            onChange={(e) => setValueField(e.target.value, "description")}
          />
        </div>
        <div className="inputfield">
          <label>{t("general.price")}</label>
          <Grid2
            container
            spacing={2}
            sx={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Grid2 size={{ xs: 6, sm: 6 }}>
              <div className="inputfield">
                <input
                  placeholder={t("general.placeholders.price")}
                  type="text"
                  name="price"
                  value={values["price"]}
                  onChange={(e) => setValueField(e.target.value, "price")}
                />
                <span>({store.profile?.valuta || "euro"})</span>
              </div>
            </Grid2>
            <Grid2 size={{ xs: 6, sm: 6 }}>
              <button
                className="secondaryButton"
                onClick={() => setShowCalculator(true)}
              >
                {t("general.calculator")}
              </button>
            </Grid2>
          </Grid2>
        </div>
        <div className="inputfield">
          <label>{t("general.quantity")}</label>
          <input
            placeholder={t("general.placeholders.quantity")}
            type="number"
            name="quantity"
            value={values["quantity"] || "1"}
            onChange={(e) =>
              setValueField(e.target.valueAsNumber.toString(), "quantity")
            }
          />
        </div>
        <div className="inputfield">
          <label>{t("general.categories")}*</label>
          <Select
            placeholder={t("general.select")}
            closeMenuOnSelect={false}
            isMulti
            options={categories.filter((item) => item.type === "category")}
            onChange={(e) => setSelectField(e, "category")}
          />
        </div>
        <div className="inputfield">
          <label>{t("general.statuses")}*</label>
          <Select
            placeholder={t("general.select")}
            closeMenuOnSelect={true}
            options={categories.filter((item) => item.type === "status")}
            onChange={(e) => setSelectField(e, "status")}
          />
        </div>
        <div className="inputfield">
          <label>{t("general.type")}*</label>
          <Select
            placeholder={t("general.select")}
            closeMenuOnSelect={true}
            options={categories.filter((item) => item.type === "arttype")}
            onChange={(e) => setSelectField(e, "arttype")}
          />
        </div>
        <p className="marginV">{t("general.image")}</p>
        <div
          className="pick pointer flex border8Round"
          onClick={(e) => setShowMediaLibrary(true)}
        >
          <img src={pick} className="iconImage" />
          <p className="underline">{t("general.selectlibrary")}</p>
          {showMediaLibrary === true && (
            <img
              src={close}
              onClick={(e) => {
                e.stopPropagation();
                setShowMediaLibrary(false);
              }}
              className="last smallImageW paddingH"
            />
          )}
        </div>
        {showMediaLibrary === true ? (
          <section className="scrollable">
            <Media onSelect={(data) => selectedImage(data)} />
          </section>
        ) : (
          <FileUploader
            multiple={false}
            handleChange={handleChange}
            name="file"
            types={["png", "jpg", "jpeg"]}
          >
            <div className="uploadContainer pointer">
              {files.length > 0 ? (
                <div className="uploadpreview">
                  <GetImage file={files[0]} />
                  <p>{`${t("general.filename")} ${files[0].name}`}</p>
                </div>
              ) : original ? (
                <div className="uploadpreview">
                  <img
                    id="image"
                    className=""
                    src={`data:image/png;base64,${original}`}
                  />
                </div>
              ) : pending ? (
                <div className="upload">
                  <img className="iconImage rotate" src={pendingimage} />
                  <p className="smallText">{t("general.loading")}</p>
                </div>
              ) : (
                <div className="upload">
                  <img className="iconImage" src={uploadimage} />
                  <p className="smallText">{t("general.upload")}</p>
                </div>
              )}
            </div>
          </FileUploader>
        )}
        {props.error && <p className="error">{props.error}</p>}
        <div className="buttonblock">
          <button className="secondaryButton" onClick={() => props.onClose()}>
            {t("general.cancel")}
          </button>
          <button
            disabled={checkFields()}
            className="primaryButton"
            onClick={() => {
              saveArtPiece();
            }}
          >
            {t("general.save")}
          </button>
        </div>
      </section>
      <Modal
        title={t("general.calculator")}
        closeicon={""}
        visible={showCalculator}
        onClose={function (): void {
          setShowCalculator(false);
        }}
      >
        <Calculator
          price={values["price"] || "0"}
          width={values["w"] || "0"}
          height={values["h"] || "0"}
        />
      </Modal>
    </>
  );
};

const createDimensions = (w: string, h: string, d: string) => {
  if (d) {
    if (w) {
      if (h) {
        return `${parseInt(h)} x ${parseInt(w)} x ${parseInt(d)}`;
      } else {
        return "";
      }
    } else {
      return "";
    }
  } else {
    if (w) {
      if (h) {
        return `${parseInt(h)} x ${parseInt(w)}`;
      } else {
        return "";
      }
    } else {
      return "";
    }
  }
};

export const EditArtpiece = (props: EditArtpieceProps) => {
  const [values, setValues] = useState({} as KeyValue);
  const [files, setFiles] = useState([] as File[]);
  const [original, setOriginal] = useState("");
  const [pending, setPending] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [image, setImage] = useState("");
  const [showCalculator, setShowCalculator] = useState(false);
  const store = useContext(ContextStorage);

  const { t } = useTranslation();

  const loadImage = async (id: string) => {
    setPending(true);
    getImagePathOriginal(id).then((res) => {
      setOriginal(res);
      setPending(false);
    });
  };

  useEffect(() => {
    const parts = props.artpiece?.dimensions?.split("x");
    values["title"] = props.artpiece.title;
    values["h"] = (parts && parts[0]) || "";
    values["w"] = (parts && parts[1]) || "";
    values["d"] = (parts && parts[2]) || "";
    values["description"] = props.artpiece.description;
    values["price"] = props.artpiece.price;
    values["year"] = props.artpiece.creation_date;
    values["media"] = props.artpiece.media;
    values["quantity"] = props.artpiece.quantity || "1";
    values["category"] = props.artpiece.cats.filter(
      (item) => item.type === "category",
    );
    values["status"] = props.artpiece.cats.filter(
      (item) => item.type === "status",
    )[0];
    values["arttype"] = props.artpiece.cats.filter(
      (item) => item.type === "arttype",
    )[0];
    setValues({ ...values });
    loadImage(props.artpiece.pictures[0]?.url);
    setImage(props.artpiece.pictureId[0]);
  }, [props.artpiece]);

  const setValueField = (text: string, name: string) => {
    values[name] = text;
    setValues({ ...values });
  };

  const handleChange = (file: File) => {
    setFiles([file]);
    setImage("");
  };

  const checkFields = () => {
    if (values["w"] && !values["h"]) {
      return true;
    }

    if (values["title"] && (files.length > 0 || original)) {
      return false;
    }
    return true;
  };

  const setSelectField = (
    selections: SingleValue<Category> | MultiValue<Category>,
    name: string,
  ) => {
    values[name] = selections;
    setValues({ ...values });
  };

  const saveArtPiece = () => {
    const cats = [];
    cats.push(
      ...(values["category"] as MultiValue<Category>).map((item) => item._id),
    );
    cats.push((values["status"] as SingleValue<Category>)?._id as string);
    cats.push((values["arttype"] as SingleValue<Category>)?._id as string);
    props.onSave({
      image: files.length > 0 ? files[0] : image,
      title: values["title"],
      dimensions: createDimensions(values["w"], values["h"], values["d"]),
      description: values["description"],
      price: values["price"],
      year: values["year"],
      media: values["media"],
      quantity: values["quantity"] ? values["quantity"].toString() : "1",
      categories: cats,
    });
  };

  const selectedImage = (data: { url: string; id: string }) => {
    setShowMediaLibrary(false);
    setFiles([]);
    setImage(data.id);
    loadImage(data.url);
  };

  return (
    <>
      <section className="form">
        <div className="inputfield">
          <label>{t("general.title")}*</label>
          <input
            placeholder={t("general.placeholders.title")}
            type="text"
            name="title"
            value={values["title"]}
            onChange={(e) => setValueField(e.target.value, "title")}
          />
        </div>
        <div className="inputfield">
          <p>{t("general.dimensions")}</p>
          <div className="dimensions">
            <label>
              {t("general.length")}
              <span>({store.profile?.measures || "cm"})</span>
            </label>
            <input
              placeholder={t("general.placeholders.height")}
              type="text"
              name="h"
              value={values["h"]}
              onChange={(e) => setValueField(e.target.value, "h")}
            />
            <label>
              {t("general.width")}
              <span>({store.profile?.measures || "cm"})</span>
            </label>
            <input
              disabled={values["h"] ? false : true}
              placeholder={t("general.placeholders.width")}
              type="text"
              name="w"
              value={values["w"]}
              onChange={(e) => setValueField(e.target.value, "w")}
            />
            <label>
              {t("general.depth")}
              <span>({store.profile?.measures || "cm"})</span>
            </label>
            <input
              disabled={values["w"] && values["h"] ? false : true}
              placeholder={t("general.placeholders.depth")}
              type="text"
              name="d"
              value={values["d"]}
              onChange={(e) => setValueField(e.target.value, "d")}
            />
          </div>
        </div>
        <div className="inputfield">
          <label>{t("general.media")}</label>
          <input
            placeholder={t("general.placeholders.media")}
            type="text"
            name="media"
            value={values["media"]}
            onChange={(e) => setValueField(e.target.value, "media")}
          />
        </div>
        <div className="inputfield">
          <label>{t("general.year")}</label>
          <input
            placeholder={t("general.placeholders.year")}
            type="text"
            name="year"
            value={values["year"]}
            onChange={(e) => setValueField(e.target.value, "year")}
          />
        </div>

        <div className="inputfield">
          <label>{t("general.description")}</label>
          <input
            placeholder={t("general.placeholders.description")}
            type="text"
            name="description"
            value={values["description"]}
            onChange={(e) => setValueField(e.target.value, "description")}
          />
        </div>
        <div className="inputfield">
          <label>{t("general.price")}</label>
          <Grid2
            container
            spacing={6}
            sx={{
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <Grid2 size={{ xs: 6, sm: 6 }}>
              <div className="inputfield">
                <input
                  placeholder={t("general.placeholders.price")}
                  type="text"
                  name="price"
                  value={values["price"]}
                  onChange={(e) => setValueField(e.target.value, "price")}
                />
                <span>({store.profile?.valuta || "euro"})</span>
              </div>
            </Grid2>
            <Grid2 size={{ xs: 6, sm: 6 }}>
              <button
                className="secondaryButton"
                onClick={() => setShowCalculator(true)}
              >
                {t("general.calculator")}
              </button>
            </Grid2>
          </Grid2>
        </div>

        <div className="inputfield">
          <label>{t("general.quantity")}</label>
          <input
            placeholder={t("general.placeholders.quantity")}
            type="number"
            name="quantity"
            value={values["quantity"]}
            onChange={(e) =>
              setValueField(e.target.valueAsNumber.toString(), "quantity")
            }
          />
        </div>
        <div className="inputfield">
          <label>{t("general.categories")}</label>
          <Select
            placeholder={t("general.select")}
            value={values["category"]}
            closeMenuOnSelect={false}
            isMulti
            options={props.categories.filter(
              (item) => item.type === "category",
            )}
            onChange={(e) => setSelectField(e, "category")}
          />
        </div>
        <div className="inputfield">
          <label>{t("general.statuses")}</label>
          <Select
            placeholder={t("general.select")}
            closeMenuOnSelect={false}
            value={values["status"]}
            options={props.categories.filter((item) => item.type === "status")}
            onChange={(e) => setSelectField(e, "status")}
          />
        </div>
        <div className="inputfield">
          <label>{t("general.type")}</label>
          <Select
            placeholder={t("general.select")}
            closeMenuOnSelect={false}
            value={values["arttype"]}
            options={props.categories.filter((item) => item.type === "arttype")}
            onChange={(e) => setSelectField(e, "arttype")}
          />
        </div>
        <p className="marginV">{t("general.image")}</p>
        <div
          className="pick pointer flex border8Round"
          onClick={(e) => setShowMediaLibrary(true)}
        >
          <img src={pick} className="iconImage" />
          <p className="underline">{t("general.selectlibrary")}</p>
          {showMediaLibrary === true && (
            <img
              src={close}
              onClick={(e) => {
                e.stopPropagation();
                setShowMediaLibrary(false);
              }}
              className="last smallImageW paddingH"
            />
          )}
        </div>
        {showMediaLibrary === true ? (
          <section className="scrollable">
            <Media onSelect={(data) => selectedImage(data)} />
          </section>
        ) : (
          <FileUploader
            multiple={false}
            handleChange={handleChange}
            name="file"
            types={["png", "jpg", "jpeg"]}
          >
            <div className="uploadContainer">
              {files.length > 0 ? (
                <div className="uploadpreview">
                  <GetImage file={files[0]} />
                  <p>{`${t("general.filename")} ${files[0].name}`}</p>
                </div>
              ) : original ? (
                <div className="uploadpreview">
                  <img
                    id="image"
                    className=""
                    src={`data:image/png;base64,${original}`}
                  />
                </div>
              ) : pending ? (
                <div className="upload">
                  <img className="iconImage rotate" src={pendingimage} />
                  <p className="smallText">{t("general.loading")}</p>
                </div>
              ) : (
                <div className="upload">
                  <img className="iconImage" src={uploadimage} />
                  <p className="smallText">{t("general.upload")}</p>
                </div>
              )}
            </div>
            {props.error && <p className="error">{props.error}</p>}
          </FileUploader>
        )}

        <div className="buttonblock">
          <button className="secondaryButton" onClick={() => props.onClose()}>
            {t("general.cancel")}
          </button>
          <button
            disabled={checkFields()}
            className="primaryButton"
            onClick={() => {
              saveArtPiece();
            }}
          >
            {t("general.save")}
          </button>
        </div>
      </section>
      <Modal
        title={t("general.calculator")}
        closeicon={""}
        visible={showCalculator}
        onClose={function (): void {
          setShowCalculator(false);
        }}
      >
        <Calculator
          price={values["price"] || "0"}
          width={values["w"] || "0"}
          height={values["h"] || "0"}
        />
      </Modal>
    </>
  );
};
interface EyePasswordProps {
  onKeyDown: (e: any) => void;
  onChange: (e: any) => void;
}

const EyePassword = (props: EyePasswordProps) => {
  const [open, setOpen] = useState(true);
  const [password, setPassword] = useState("");
  return (
    <div className="eyepassword">
      <input
        type={open ? "password" : "text"}
        name="password"
        value={password}
        onKeyDown={props.onKeyDown}
        onChange={(e) => {
          setPassword(e.target.value);
          props.onChange(e);
        }}
      />
      <img
        className="mediumImageW"
        src={open ? eyeopen : eyeclose}
        onClick={() => setOpen(!open)}
      />
    </div>
  );
};

const ImageInput = (props: EyePasswordProps) => {
  const [password, setPassword] = useState("");
  return (
    <div className="eyepassword">
      <input
        type="text"
        name="password"
        value={password}
        onKeyDown={props.onKeyDown}
        onChange={(e) => {
          setPassword(e.target.value);
          props.onChange(e);
        }}
      />
      <img className="mediumImageW" src={email} />
    </div>
  );
};

export const LoginForm = () => {
  const [values, setValues] = useState({} as KeyValue);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;

  useEffect(() => {
    if (id) {
      doAutoLogin({ token: id }).then((session) => {
        if (session) {
          localStorage.setItem("session", session);
          router.push("/home");
        } else {
          setError(t("general.tokenexpired"));
        }
      });
    }
  }, []);

  const login = async () => {
    load(process.env.NEXT_PUBLIC_RC_SITE_KEY as string).then((recaptcha) => {
      recaptcha.execute("submit").then(async (token) => {
        values["token"] = token;
        const response = await doLogin(values);
        if (response) {
          localStorage.setItem("session", response.session);
          localStorage.setItem("profile", JSON.stringify(response.profile));
          router.push("/home");
        } else {
          setError(t("general.wronglogin"));
        }
      });
    });
  };

  const sendLink = async () => {
    ReactGA.event("sendlink", {
      category: "appevent",
      action: "sendlink",
      label: "Send email link", // optional
      value: 1, // optional, must be a number
      nonInteraction: true, // optional, true/false
      transport: "xhr", // optional, beacon/xhr/image
    });
    load(process.env.NEXT_PUBLIC_RC_SITE_KEY as string).then((recaptcha) => {
      recaptcha.execute("submit").then(async (token) => {
        values["token"] = token;
        const session = await doSendLink(values);
        if (session) {
          setMessage(t("general.linksent", { email: values["email"] }));
          values["email"] = "";
          setValues({ ...values });
          setEmail("");
        } else {
          setError(t("general.error"));
        }
      });
    });
  };

  const setValueField = (text: string, name: string) => {
    setError("");
    if (name === "password") {
      setPassword(text);
    } else {
      setEmail(text);
    }
    values[name] = text;
    setValues(values);
  };

  const checkSubmit = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (values["email"] && values["password"]) {
        login();
      }
    }
  };

  const checkValues = () => {
    if (values["email"] && values["password"] && isValidEmail(values["email"]))
      return true;
    return false;
  };

  return (
    <>
      <section className="form login">
        <h1>{t("general.loginexplain")}</h1>
        <div className="inputfield">
          <label>{t("general.email")}</label>
          <ImageInput
            onKeyDown={(e) => checkSubmit(e)}
            onChange={(e) => setValueField(e.target.value, "email")}
          />
        </div>
        <div className="inputfield">
          <label>{t("general.password")}</label>
          <EyePassword
            onKeyDown={(e) => checkSubmit(e)}
            onChange={(e) => setValueField(e.target.value, "password")}
          />
        </div>
        {error && <p className="error smallText">{error}</p>}
        {message && <p className="smallText">{message}</p>}
        <div className="buttonblock vertical">
          <div>
            <button
              disabled={!isValidEmail(values["email"])}
              className="secondaryButton"
              onClick={() => {
                sendLink();
              }}
            >
              {t("general.sendalink")}
            </button>
            <button
              disabled={!checkValues()}
              className="primaryButton"
              onClick={() => {
                login();
              }}
            >
              {t("general.login")}
            </button>
          </div>
          <p
            onClick={() => {
              router.push("/reset");
            }}
            className="smallText pointer select"
          >
            {t("general.forgot")}
          </p>
        </div>
        <div className="buttonblock paddingV">
          <p className="smallText">{t("general.noaccount")}</p>
          <button
            className="secondaryButton"
            onClick={() => {
              router.push("/register");
            }}
          >
            {t("general.create")}
          </button>
        </div>
      </section>
    </>
  );
};

export const ResetForm = () => {
  const [values, setValues] = useState({} as KeyValue);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { t } = useTranslation();
  const router = useRouter();

  const setValueField = (text: string, name: string) => {
    setError("");

    setEmail(text);

    values[name] = text;
    setValues(values);
  };

  const resetPassword = async () => {
    if (isValidEmail(values["email"])) {
      showWaiting();
      load(process.env.NEXT_PUBLIC_RC_SITE_KEY as string).then((recaptcha) => {
        recaptcha.execute("submit").then(async (token) => {
          values["token"] = token;
          const session = await doReset(values);
          if (session) {
            setSuccess(true);
          } else {
            setError(t("general.error"));
          }
          hideWaiting();
        });
      });
    } else {
      setError(t("general.emailerror"));
    }
  };

  const checkSubmit = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (values["email"]) {
        resetPassword();
      }
    }
  };

  return (
    <>
      {success && (
        <section className="form">
          <h1>{t("general.resetTitle")}</h1>
          <p className="">
            {t("general.successreset", { email: values["email"] })}
          </p>
          <p
            className="pointer select"
            onClick={() => {
              router.refresh();
            }}
          >
            {t("general.sendagain")}
          </p>
        </section>
      )}
      {!success && (
        <section className="form">
          <h1>{t("general.resetTitle")}</h1>
          <p className="">{t("general.resetExplain")}</p>
          <div className="inputfield">
            <label>{t("general.email")}</label>
            <input
              type="text"
              name="email"
              value={email}
              onKeyDown={(e) => checkSubmit(e)}
              onChange={(e) => setValueField(e.target.value, "email")}
            />
          </div>

          {error && <p className="error smallText">{error}</p>}
          <div className="buttonblock vertical">
            <button
              className="primaryButton"
              onClick={() => {
                resetPassword();
              }}
            >
              {t("general.reset")}
            </button>
            <p
              onClick={() => {
                router.push("/login");
              }}
              className="smallText pointer select"
            >
              {t("general.backto.login")}
            </p>
          </div>
        </section>
      )}
    </>
  );
};

export const PasswordForm = (props: { token: string }) => {
  const [values, setValues] = useState({} as KeyValue);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { t } = useTranslation();
  const router = useRouter();

  const resetPassword = async () => {
    if (password.length > 0) {
      showWaiting();
      load(process.env.NEXT_PUBLIC_RC_SITE_KEY as string).then((recaptcha) => {
        recaptcha.execute("submit").then(async (token) => {
          values["recaptcha"] = token;
          values["token"] = props.token;
          values["password"] = password;
          const session = await doChangePassword(values);
          if (!session.error) {
            setSuccess(true);
          } else {
            setError(t("general.passworderror"));
          }
          hideWaiting();
        });
      });
    } else {
      setError(t("general.emailerror"));
    }
  };

  const checkSubmit = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (values["email"]) {
        resetPassword();
      }
    }
  };

  return (
    <>
      {success && (
        <section className="form">
          <h1>{t("general.resetTitle")}</h1>
          <p className="">
            {t("general.successreset", { email: values["email"] })}
          </p>
          <p
            onClick={() => {
              router.push("/login");
            }}
            className="smallText pointer select"
          >
            {t("general.backto.login")}
          </p>
        </section>
      )}
      {!success && (
        <section className="form">
          <h1>{t("general.passwordTitle")}</h1>
          <p className="">{t("general.passwordExplain")}</p>
          <div className="inputfield">
            <label>{t("general.password")}</label>
            <EyePassword
              onKeyDown={(e) => checkSubmit(e)}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="error smallText">{error}</p>}
          <div className="buttonblock vertical">
            <button
              className="primaryButton"
              onClick={() => {
                resetPassword();
              }}
            >
              {t("general.confirm")}
            </button>
          </div>
        </section>
      )}
    </>
  );
};

export const RegisterForm = (props: {
  onSuccess: (message: string) => void;
}) => {
  const [values, setValues] = useState({} as KeyValue);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const { t } = useTranslation();

  const checkValues = () => {
    if (values["email"] && values["password"]) {
      if (isValidEmail(values["email"])) {
        register();
      } else {
        setError(t("general.emailerror"));
      }
    } else {
      setError(t("general.typein"));
    }
  };

  const register = async () => {
    load(process.env.NEXT_PUBLIC_RC_SITE_KEY as string).then((recaptcha) => {
      recaptcha.execute("submit").then(async (token) => {
        values["token"] = token;
        const session = await doRegister(values);
        if (session) {
          props.onSuccess(t("general.registrationsuccess"));
        } else {
          setError(t("general.registrationalready"));
        }
      });
    });
  };

  const setValueField = (text: string, name: string) => {
    setError("");
    setSuccess("");
    if (name === "email") {
      setEmail(text);
    } else if (name === "password") {
      setPassword(text);
    }
    values[name] = text;
    setValues(values);
  };

  const checkSubmit = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      checkValues();
    }
  };

  return (
    <>
      <section className="form">
        <div className="inputfield">
          <label>{t("general.email")}</label>
          <ImageInput
            onKeyDown={(e) => checkSubmit(e)}
            onChange={(e) => setValueField(e.target.value, "email")}
          />
          <div>&nbsp;</div>
        </div>
        <div className="inputfield">
          <label>{t("general.password")}</label>
          <EyePassword
            onKeyDown={(e) => checkSubmit(e)}
            onChange={(e) => setValueField(e.target.value, "password")}
          />
          <div>&nbsp;</div>
        </div>
        <div className="inputfield check">
          <div>&nbsp;</div>
          <input
            type="checkbox"
            name="terms"
            checked={terms}
            onClick={(e) => setTerms(!terms)}
          />
          <a target="_blank" href="/privacypolicy.pdf">
            {t("general.termscondition")}
          </a>
        </div>
        {error && <p className="error smallText">{error}</p>}
        <div className="buttonblock">
          <button
            disabled={
              !isValidEmail(values["email"]) || !values["password"] || !terms
            }
            className="primaryButton"
            onClick={() => {
              checkValues();
            }}
          >
            {t("general.register")}
          </button>
        </div>
      </section>
    </>
  );
};

export const ManageCategories = (props: { type: string }) => {
  const [values, setValues] = useState({} as KeyValue);
  const [categories, setCategories] = useState([] as Category[]);
  const [showDelete, setShowDelete] = useState("");
  const router = useRouter();
  const { t } = useTranslation();

  const setValueField = (text: string, name: string) => {
    values[name] = text;
    setValues({ ...values });
  };

  useEffect(() => {
    getCategories(props.type).then((cats) => {
      setCategories(cats);
    });
  }, [props.type]);

  const saveCategory = () => {
    showWaiting();
    const cat = values["category"];
    if (categories.findIndex((item) => item.label === cat) === -1) {
      addCategory({ label: cat, value: cat, type: props.type }).then((res) => {
        hideWaiting();
        router.refresh();
      });
    }
  };

  const removeCategory = (id: string) => {
    showWaiting();

    deleteCategory(id).then((res: AxiosResponse<any, any> | null) => {
      hideWaiting();
      router.refresh();
    });
  };

  return (
    <>
      <section className="form">
        <p className="breadcrumb">
          {t(`general.category.title.${props.type}`)}
        </p>
        <div className="inputfield">
          <label>{t(`general.category.${props.type}`)}*</label>
          <input
            placeholder={t(`general.placeholders.category.${props.type}`)}
            type="text"
            name="category"
            value={values["category"]}
            onChange={(e) => setValueField(e.target.value, "category")}
          />
        </div>

        <div className="buttonblock">
          <button
            disabled={!values["category"]}
            className="primaryButton"
            onClick={() => {
              saveCategory();
            }}
          >
            {t("general.save")}
          </button>
        </div>

        {categories.length > 0 ? (
          <section className="categorylist border8Round paddingAllBig marginV">
            {categories.map((cat) => {
              return (
                <div className="categories">
                  {cat.label}
                  <img
                    className="smallImageW last pointer trash"
                    onClick={() => setShowDelete(cat._id)}
                    src={remove}
                  />
                </div>
              );
            })}
          </section>
        ) : (
          <section className="flexC center">
            <img className="iconImageBig" src={empty} />
            <p className="center">{t(`general.nocategories.${props.type}`)}</p>
          </section>
        )}
        <Modal
          title={t("general.delete")}
          closeicon={""}
          visible={showDelete !== ""}
          onClose={function (): void {
            setShowDelete("");
          }}
        >
          <p>{t("general.suredelete")}</p>
          {showDelete !== "" && (
            <p className="center strong paddingV">
              {categories.filter((item) => item._id === showDelete)[0].label}
            </p>
          )}
          <div className="buttonblock">
            <button
              className="secondaryButton"
              onClick={() => setShowDelete("")}
            >
              {t("general.cancel")}
            </button>
            <button
              className="primaryButton"
              onClick={() => {
                removeCategory(showDelete);
              }}
            >
              {t("general.delete")}
            </button>
          </div>
        </Modal>
      </section>
    </>
  );
};

interface SearchProps {
  onChange: (search: string) => void;
}

export const SearchBlock = (props: SearchProps) => {
  const [search, setSearch] = useState("");

  const filterSearch = (text: string) => {
    setSearch(text);
    props.onChange(text);
  };

  return (
    <div className="searchContainer">
      <div className="filterBlock">
        <input
          type="text"
          value={search}
          onChange={(e) => filterSearch(e.target.value)}
        />
        <img src={searchIcon} className="smallImageW" />
      </div>
    </div>
  );
};
