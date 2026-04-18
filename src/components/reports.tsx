import { useTranslation } from "react-i18next";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
const graypie = "/images/piegray.svg";
const clear = "/images/no.svg";
import {
  apiGetReport,
  GetImage,
  getImagePathOriginal,
  getReports,
  getSelections,
  getStatistics,
  hideWaiting,
  saveProfile,
  showWaiting,
  useAppStateListener,
} from "./utility";
import { ArtSelection, KeyValue, Profile, Reports } from "../interfaces";
import { Modal } from "./modal";
import { ShowPDF } from "./pdfview";
import Select, { SingleValue } from "react-select";
import useDownloader from "react-use-downloader";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { StatsData, StatusPie } from "./statistics";
import { Media } from "./media";
import { FileUploader } from "react-drag-drop-files";
const pendingimage = "/images/cog.svg";
const uploadimage = "/images/upload.svg";
const pick = "/images/choose.svg";
const close = "/images/closeicon.svg";
const frontcover = "/images/frontcover.jpg";
import { ContextStorage } from "../store";
import { Checkbox } from "@mui/material";

export const ReportsComponent = () => {
  const { t } = useTranslation();
  const state =
    typeof window !== "undefined"
      ? JSON.parse(sessionStorage.getItem("routeState") || "null")
      : null;
  const [profile, setProfile] = useState<Profile>();
  const [files, setFiles] = useState([] as File[]);
  const [select, setSelect] = useState("");
  const [selectedList, setSelectedList] =
    useState<SingleValue<{ label: string; value: string }>>();
  const [selections, setSelections] = useState([] as ArtSelection[]);
  const [reports, setReports] = useState([] as Reports[]);
  const [reportFile, setReportFile] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [frontImage, setFrontImage] = useState("");
  const [backImage, setBackImage] = useState("");
  const [pending, setPending] = useState(false);
  const [frontCover, setFrontCover] = useState(false);
  const [backCover, setBackCover] = useState(false);
  const [image, setImage] = useState("");
  const [showSelect, setShowSelect] = useState("");
  const [original, setOriginal] = useState("");
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [values, setValues] = useState({
    name: true,
    description: true,
    price: false,
    dimensions: true,
    media: true,
  } as KeyValue);
  const params = useParams();
  const id = params?.id as string | undefined;
  const [stats, setStats] = useState<StatsData | undefined>(undefined);
  const [selected, setSelected] = useState([] as string[]);
  const { download } = useDownloader();
  const store = useContext(ContextStorage);

  useEffect(() => {
    getStatistics().then((data) => {
      if (data) {
        setStats(data as StatsData);
      }
    });

    getSelections().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setSelections(data);
        if (id) {
          const item = data.find((item) => item._id === id);
          if (item) {
            setSelectedList({ label: item.name, value: item._id as string });
          }
        }
      } else {
        setSelections([]);
      }
    });

    return () => {
      if (reportFile) {
        URL.revokeObjectURL(reportFile);
      }
    };
  }, []);

  useEffect(() => {
    getReports().then((result) => {
      setReports(result);
    });

    if (Array.isArray(state) && state.length > 0) {
      setSelected(state);
      setTabIndex(1);
    }
  }, []);

  useEffect(() => {
    if (store.profile?.front) {
      setFrontImage(`data:image/png;base64,${store.profile.front}`);
    }
    if (store.profile?.back) {
      setBackImage(`data:image/png;base64,${store.profile.back}`);
    }
  }, [store]);

  useAppStateListener((store) => {
    if (store.profile?.front) {
      setFrontImage(`data:image/png;base64,${store.profile.front}`);
    }
    if (store.profile?.back) {
      setBackImage(`data:image/png;base64,${store.profile.back}`);
    }
  });

  const loadReport = async (preview: boolean) => {
    showWaiting();
    try {
      if (reportFile) {
        URL.revokeObjectURL(reportFile);
      }
      const body = {
        fields: { ...values, frontCover, backCover },
        catalog: select,
        selectedList: selected,
        listId: selectedList?.value,
      };
      console.log("Body", body);
      const response = await apiGetReport(body);

      if (response) {
        const blob = new Blob([response]);
        const file = URL.createObjectURL(blob);
        setReportFile(file);
        if (!preview) {
          download(file, `report.pdf`);
        }
        hideWaiting();
      } else {
        hideWaiting();
      }
    } catch (e) {
      hideWaiting();
    }
  };

  const showReport = () => {
    loadReport(true);
    setShowPreview(true);
  };

  const downloadReport = async () => {
    if (!reportFile) {
      loadReport(false);
    } else {
      download(reportFile, `report.pdf`);
    }
  };

  const setValueField = (key: string) => {
    values[key] = values[key] ? false : true;
    setValues({ ...values });
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

  const handleChange = (file: File) => {
    setFiles([file]);
    setImage("");
  };

  const save = async (which: string) => {
    const formData = new FormData();

    formData.append("filetype", which);

    if (files.length > 0) {
      formData.append("document", files[0]);
      formData.append("originalname", files[0].name);
    }

    if (image) {
      formData.append("imageId", image);
    }

    const response = await saveProfile(formData);
    if (response) {
    } else {
    }
  };

  const saveImage = (which: string) => {
    save(which);
  };

  return (
    <>
      <Tabs selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
        <TabList>
          <Tab>{t("general.stats.title")}</Tab>
          <Tab>{t("general.reports")}</Tab>
        </TabList>

        <TabPanel>
          {stats && Object.keys(stats).length > 0 && (
            <div className="statistics">
              <StatusPie
                key="cat"
                dataset={stats.categories}
                seed="category"
                title={t("general.stats.categoryTitle")}
              />
              <StatusPie
                key="art"
                dataset={stats.arttpyes}
                seed="arttype1"
                title={t("general.stats.arttypeTitle")}
              />
              <StatusPie
                key="status"
                dataset={stats.statuses}
                seed="statuses1"
                title={t("general.stats.statusTitle")}
              />
            </div>
          )}
          {!stats && (
            <section className="nochart">
              <img src={graypie} />
            </section>
          )}
        </TabPanel>
        <TabPanel>
          <section className="reportMain">
            <p className="">{t("general.howtoreport")}</p>
            <div className="reportContainer">
              <div className="reportheader">
                <div className="selectlist">
                  <p className="strong">{t("general.point1selectlist")}</p>
                  {selected.length <= 0 && (
                    <div className="inputfield">
                      <Select
                        placeholder={t("general.select")}
                        closeMenuOnSelect={true}
                        value={selectedList}
                        isMulti={false}
                        options={selections.map((item) => {
                          return {
                            label: item.name,
                            value: item._id as string,
                          };
                        })}
                        onChange={(e) => setSelectedList(e)}
                      />
                    </div>
                  )}
                  {selected.length > 0 && (
                    <div className="flex">
                      <p className="paddingH">
                        {t("general.artworkselected", {
                          howmany: selected.length,
                        })}{" "}
                      </p>
                      <img
                        className="smallImageW pointer"
                        onClick={(e) => {
                          setSelected([]);
                        }}
                        src={clear}
                      />
                    </div>
                  )}
                </div>
                <div className="fields">
                  <p>{t("general.selectfields")}</p>
                  <div className="selections">
                    <div className="inputfield">
                      <label>{t("general.fieldName")}</label>
                      <input
                        className="fieldcheck"
                        type="checkbox"
                        checked={values["name"]}
                        name="name"
                        onChange={(e) => setValueField("name")}
                      />
                    </div>
                    <div className="inputfield">
                      <label>{t("general.fieldDescription")}</label>
                      <input
                        className="fieldcheck"
                        type="checkbox"
                        name="description"
                        checked={values["description"]}
                        onChange={(e) => setValueField("description")}
                      />
                    </div>
                    <div className="inputfield">
                      <label>{t("general.fieldDimensions")}</label>
                      <input
                        className="fieldcheck"
                        type="checkbox"
                        name="dimensions"
                        checked={values["dimensions"]}
                        onChange={(e) => setValueField("dimensions")}
                      />
                    </div>
                    <div className="inputfield">
                      <label>{t("general.fieldPrice")}</label>
                      <input
                        className="fieldcheck"
                        type="checkbox"
                        name="price"
                        checked={values["price"]}
                        onChange={(e) => setValueField("price")}
                      />
                    </div>
                    <div className="inputfield">
                      <label>{t("general.fieldMedia")}</label>
                      <input
                        className="fieldcheck"
                        type="checkbox"
                        name="media"
                        checked={values["media"]}
                        onChange={(e) => setValueField("media")}
                      />
                    </div>
                    <div className="inputfield">
                      <label>{t("general.fieldYear")}</label>
                      <input
                        className="fieldcheck"
                        type="checkbox"
                        name="year"
                        checked={values["year"]}
                        onChange={(e) => setValueField("year")}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <p className="strong">{t("general.point2selectreport")}</p>
                <div className="reportlist">
                  {reports &&
                    reports.map((rep) => {
                      return (
                        <div className="report">
                          {values["description"] &&
                          rep.name !== "singlepage" &&
                          rep.name !== "listicon" ? (
                            <img
                              className={`reportImage disabled off`}
                              src={`data:image/jpeg;base64, ${rep.image}`}
                            />
                          ) : (
                            <img
                              onClick={() => setSelect(rep.name)}
                              src={`data:image/jpeg;base64, ${rep.image}`}
                              className={`reportImage ${select === rep.name ? "selected" : ""}`}
                            />
                          )}
                          <p className="smallText">
                            {t(`general.report.name_${rep.name}`)}
                          </p>
                        </div>
                      );
                    })}
                </div>
              </div>
              <div>
                <p className="strong">{t("general.point3addfrontback")}</p>
                <div className="reportlist">
                  <div className="report">
                    <img
                      className={`reportImage ${frontCover ? "" : "off"}`}
                      src={frontImage || frontcover}
                      onClick={() => setShowSelect("front")}
                    />
                    <p className="smallText">
                      {t(`general.front`)}
                      <Checkbox
                        value={frontCover}
                        onChange={(e) => setFrontCover(e.target.checked)}
                      />
                    </p>
                  </div>
                  <div className="report">
                    <img
                      className={`reportImage ${backCover ? "" : "off"}`}
                      src={backImage || frontcover}
                      onClick={() => setShowSelect("back")}
                    />
                    <p className="smallText">
                      {t(`general.back`)}
                      <Checkbox
                        value={backCover}
                        onChange={(e) => setBackCover(e.target.checked)}
                      />
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="buttonblock">
              <button
                disabled={
                  !(!!select && (!!selectedList || selected.length > 0))
                }
                className="secondaryButton"
                onClick={() => showReport()}
              >
                {t("general.show")}
              </button>
              <button
                disabled={
                  !(!!select && (!!selectedList || selected.length > 0))
                }
                className="primaryButton"
                onClick={() => downloadReport()}
              >
                {t("general.download")}
              </button>
            </div>

            <Modal
              title={t("general.preview")}
              closeicon={""}
              visible={showPreview}
              onClose={function (): void {
                setShowPreview(false);
              }}
            >
              {reportFile && <ShowPDF url={reportFile} />}
            </Modal>
            <Modal
              title={t("general.selectimage")}
              closeicon={""}
              visible={showSelect !== ""}
              onClose={function (): void {
                setShowSelect("");
              }}
            >
              <div>
                <div className="">
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
                          <img
                            className="iconImage rotate"
                            src={pendingimage}
                          />
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
                </div>
                <div className="buttonblock">
                  <button
                    disabled={false}
                    className="secondaryButton"
                    onClick={() => setShowSelect("")}
                  >
                    {t("general.cancel")}
                  </button>
                  <button
                    disabled={files.length <= 0 && !image}
                    className="primaryButton"
                    onClick={() => saveImage(showSelect)}
                  >
                    {t("general.confirm")}
                  </button>
                </div>
              </div>
            </Modal>
          </section>
        </TabPanel>
      </Tabs>
    </>
  );
};
