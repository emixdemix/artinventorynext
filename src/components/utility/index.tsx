import axios, { AxiosResponse } from "axios";
import {
  ArtPiece,
  ArtSelection,
  Category,
  Customer,
  GeneralAPIError,
  KeyValue,
  PictureDao,
  Reports,
  Shows,
  StoreContext,
  Timeout,
} from "../../interfaces";
import { createEvent } from "react-event-hook";
import { useEffect, useState } from "react";
const pendingimage = "/images/cog.svg";
import { StatsData } from "../statistics";

export const uploadArtPiece = async (formData: FormData) => {
  const localSession = localStorage.getItem("session");
  try {
    const response = await axios.post(`/api/artpiece`, formData, {
      headers: {
        "X-Token": localSession,
        "Content-Type": "multipart/form-data",
      },
    });
    return true;
  } catch (e) {
    return false;
  }
};

export const apiMoveMedia = async (payload: KeyValue) => {
  const localSession = localStorage.getItem("session");
  try {
    const response = await axios.post(
      `/api/movemedia`,
      {
        ...payload,
      },
      {
        headers: {
          "X-Token": localSession,
          "Content-Type": "application/json",
        },
      },
    );
    return true;
  } catch (e) {
    return false;
  }
};

export const apiCreateFolder = async (folder: string) => {
  const localSession = localStorage.getItem("session");
  try {
    const response = await axios.post(
      `/api/folder`,
      {
        folder,
      },
      {
        headers: {
          "X-Token": localSession,
          "Content-Type": "application/json",
        },
      },
    );
    return true;
  } catch (e) {
    return false;
  }
};

export const apiDeleteFolder = async (folder: string) => {
  const localSession = localStorage.getItem("session");
  try {
    const response = await axios.delete(`/api/folder`, {
      params: {
        folder,
      },
      headers: { "X-Token": localSession, "Content-Type": "application/json" },
    });
    return true;
  } catch (e) {
    return false;
  }
};

export const uploadMediaPiece = async (formData: FormData) => {
  const localSession = localStorage.getItem("session");
  try {
    const response = await axios.post(`/api/media`, formData, {
      headers: {
        "X-Token": localSession,
        "Content-Type": "multipart/form-data",
      },
    });
    return true;
  } catch (e) {
    return false;
  }
};

export const updateArtPiece = async (formData: FormData) => {
  const localSession = localStorage.getItem("session");
  try {
    const response = await axios.patch(`/api/artpiece`, formData, {
      headers: {
        "X-Token": localSession,
        "Content-Type": "multipart/form-data",
      },
    });
    return true;
  } catch (e) {
    return false;
  }
};

export const updateSelectionOrder = async (data: {
  selections: string[];
  selectionId: string;
}) => {
  const localSession = localStorage.getItem("session");
  try {
    const response = await axios.put(`/api/selections`, data, {
      headers: { "X-Token": localSession, "Content-Type": "application/json" },
    });
    return true;
  } catch (e) {
    return false;
  }
};

export const deleteArtPiece = async (artPieceId: string) => {
  const localSession = localStorage.getItem("session");
  try {
    const response = await axios.delete(`/api/artpiece`, {
      params: {
        artPieceId,
      },
      headers: { "X-Token": localSession, "Content-Type": "application/json" },
    });
    return true;
  } catch (e) {
    return false;
  }
};

export const deleteMediaPiece = async (mediaId: string) => {
  const localSession = localStorage.getItem("session");
  try {
    const response = await axios.delete(`/api/media`, {
      params: {
        mediaId,
      },
      headers: { "X-Token": localSession, "Content-Type": "application/json" },
    });
    return true;
  } catch (e) {
    return false;
  }
};

export const doLogin = async (values: KeyValue) => {
  try {
    const response = await axios.post(
      `/papi/login`,
      {
        "g-recaptcha-response": values.token,
        username: values.email,
        password: values.password,
      },
      {
        headers: {},
      },
    );
    if (response.status === 200) {
      return response.data;
    } else {
      return "";
    }
  } catch (e) {
    return "";
  }
};

export const doSendLink = async (values: KeyValue) => {
  try {
    const response = await axios.post(
      `/papi/sendlink`,
      {
        "g-recaptcha-response": values.token,
        email: values.email,
      },
      {
        headers: {},
      },
    );
    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
};

export const doChangePassword = async (
  values: KeyValue,
): Promise<GeneralAPIError> => {
  try {
    const response = await axios.post(
      `/papi/changepassword`,
      {
        "g-recaptcha-response": values.recaptcha,
        token: values.token,
        password: values.password,
      },
      {
        headers: {},
      },
    );
    if (response.status === 200) {
      return { error: false, response };
    } else {
      return { error: true, response };
    }
  } catch (e) {
    return { error: true, response: { e } };
  }
};

export const doRegister = async (values: KeyValue) => {
  try {
    const response = await axios.post(
      `/papi/register`,
      {
        "g-recaptcha-response": values.token,
        username: values.email,
        password: values.password,
      },
      {
        headers: {},
      },
    );
    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
};

export const doReset = async (values: KeyValue) => {
  try {
    const response = await axios.post(
      `/papi/reset`,
      {
        "g-recaptcha-response": values.token,
        email: values.email,
      },
      {
        headers: {},
      },
    );
    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
};

export const doConfirm = async (values: KeyValue) => {
  try {
    const response = await axios.post(
      `/papi/confirm`,
      {},
      {
        headers: {
          "X-Token": values.token,
        },
      },
    );
    if (response.status === 200) {
      return response.data;
    } else {
      return "";
    }
  } catch (e) {
    return "";
  }
};

export const doAutoLogin = async (values: KeyValue) => {
  try {
    const response = await axios.post(
      `/papi/autologin`,
      {},
      {
        headers: {
          "X-Token": values.token,
        },
      },
    );
    if (response.status === 200) {
      return response.data.session;
    } else {
      return "";
    }
  } catch (e) {
    return "";
  }
};

export const checkSession = async (): Promise<boolean> => {
  const localSession = localStorage.getItem("session");
  if (localSession) {
    try {
      const response = await axios.get(`/api/validsession`, {
        headers: {
          "X-Token": localSession,
        },
      });
      if (response.status === 200) {
        return true;
      } else {
        localStorage.removeItem("session");
        return false;
      }
    } catch (e) {
      localStorage.removeItem("session");
      return false;
    }
  } else {
    return false;
  }
};

export const getCategories = async (type: string) => {
  const localSession = localStorage.getItem("session");

  try {
    const response = await axios.get(`/api/categories`, {
      params: { type },
      headers: {
        "X-Token": localSession,
        "Cache-Control": "no-cache",
      },
    });
    if (response.status === 200) {
      return response.data;
    } else {
      return "";
    }
  } catch (e) {
    return "";
  }
};

export const getProfile = async () => {
  const localSession = localStorage.getItem("session");

  try {
    const response = await axios.get(`/api/profile`, {
      headers: {
        "X-Token": localSession,
        "Cache-Control": "no-cache",
      },
    });
    if (response.status === 200) {
      return response.data;
    } else {
      return "";
    }
  } catch (e) {
    return "";
  }
};

export const addCategory = async (data: KeyValue) => {
  const localSession = localStorage.getItem("session");

  try {
    const response = await axios.post(`/api/category`, data, {
      headers: {
        "X-Token": localSession,
      },
    });
    if (response.status === 200) {
      return response.data;
    } else {
      return "";
    }
  } catch (e) {
    return "";
  }
};

export const addFeedback = async (data: KeyValue) => {
  const localSession = localStorage.getItem("session");
  try {
    const response = await axios.post(`/api/feedback`, data, {
      headers: {
        "X-Token": localSession,
      },
    });
    if (response.status === 200) {
      return response.data;
    } else {
      return "";
    }
  } catch (e) {
    return "";
  }
};

export const saveProfile = async (data: KeyValue): Promise<GeneralAPIError> => {
  const localSession = localStorage.getItem("session");

  try {
    const response = await axios.post(`/api/profile`, data, {
      headers: {
        "X-Token": localSession,
      },
    });
    if (response.status === 200) {
      return { error: false, response: response.data };
    } else {
      return { error: true, response: response };
    }
  } catch (e) {
    return { error: true, response: { e } };
  }
};

export const convertIsoDate = (iso: string) => {
  const d = new Date(iso);
  let day = d.getDate() >= 10 ? d.getDate() : `0${d.getDate()}`;
  let month =
    d.getMonth() + 1 >= 10 ? d.getMonth() + 1 : `0${d.getMonth() + 1}`;
  let hours = d.getHours() >= 10 ? d.getHours() : `0${d.getHours()}`;
  let minutes = d.getMinutes() >= 10 ? d.getMinutes() : `0${d.getMinutes()}`;

  return `${day}-${month}-${d.getFullYear()} ${hours}:${minutes}`;
};

export const displayLabel = (
  props: { artPiece: ArtPiece },
  which: string,
  notset: string,
) => {
  const result = props.artPiece.cats.filter((item) => item.type === which);
  if (result.length > 0) {
    return result[0].label;
  } else {
    return notset;
  }
};

export const Dotted = (props: {
  text: string;
  chars: number;
  className?: string;
}) => {
  const [showAll, setShowAll] = useState(false);

  const show = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowAll(!showAll);
  };

  if (props.text && props.text.length >= props.chars) {
    return (
      <p
        onClick={(e) => show(e)}
        className={`smallerText pointer ${props.className ? props.className : ""}`}
      >
        {showAll ? props.text : `${props.text.substring(0, props.chars)}...`}
      </p>
    );
  } else {
    return (
      <p className={`smallerText ${props.className ? props.className : ""}`}>
        {props.text}
      </p>
    );
  }
};

export const apiSaveShow = async (data: KeyValue): Promise<GeneralAPIError> => {
  const localSession = localStorage.getItem("session");

  try {
    const response = await axios.post(`/api/shows`, data, {
      headers: {
        "X-Token": localSession,
      },
    });
    if (response.status === 200) {
      return { error: false, response: response.data };
    } else {
      return { error: true, response: response };
    }
  } catch (e) {
    return { error: true, response: { e } };
  }
};

export const apiSaveCustomer = async (
  data: KeyValue,
): Promise<GeneralAPIError> => {
  const localSession = localStorage.getItem("session");

  try {
    const response = await axios.post(`/api/customer`, data, {
      headers: {
        "X-Token": localSession,
      },
    });
    if (response.status === 200) {
      return { error: false, response: response.data };
    } else {
      return { error: true, response: response };
    }
  } catch (e) {
    return { error: true, response: { e } };
  }
};

export const apiGetFeedback = async (
  data: KeyValue,
): Promise<GeneralAPIError> => {
  const localSession = localStorage.getItem("session");

  try {
    const response = await axios.get(`/api/feedback`, {
      params: {
        id: data.id,
      },
      headers: {
        "X-Token": localSession,
      },
    });
    if (response.status === 200) {
      return { error: false, response: response };
    } else {
      return { error: true, response: response };
    }
  } catch (e) {
    return { error: true, response: { e } };
  }
};

export const deleteCategory = async (
  id: string,
): Promise<AxiosResponse<any, any> | null> => {
  const localSession = localStorage.getItem("session");

  try {
    const response = await axios.delete(`/api/category`, {
      params: {
        id,
        force: "true",
      },
      headers: {
        "X-Token": localSession,
      },
    });
    return response;
  } catch (e) {
    return null;
  }
};

export const getImagePath = async (basePath: string) => {
  const localSession = localStorage.getItem("session");

  try {
    const response = await axios.get(`/api/image/`, {
      params: { image: basePath, w: 60, h: 60 },
      headers: {
        "X-Token": localSession,
        "Cache-Control": "max-age=604800",
      },
    });
    if (response.status === 200) {
      return response.data;
    } else {
      return "";
    }
  } catch (e) {
    return "";
  }
};

export const getImageMedia = async (basePath: string) => {
  const localSession = localStorage.getItem("session");

  try {
    const response = await axios.get(`/api/image/`, {
      params: { image: basePath, w: 120, h: 90 },
      headers: {
        "X-Token": localSession,
        "Cache-Control": "max-age=604800",
      },
    });
    if (response.status === 200) {
      return response.data;
    } else {
      return "";
    }
  } catch (e) {
    return "";
  }
};

export const getImagePathOriginal = async (basePath: string) => {
  const localSession = localStorage.getItem("session");

  try {
    const response = await axios.get(`/api/image/`, {
      params: { image: basePath },
      headers: {
        "X-Token": localSession,
        "Cache-Control": "no-cache",
      },
    });
    if (response.status === 200) {
      return response.data;
    } else {
      return "";
    }
  } catch (e) {
    return "";
  }
};

export const getArtPieces = async (): Promise<ArtPiece[]> => {
  const localSession = localStorage.getItem("session");
  if (localSession) {
    try {
      const response = await axios.get(`/api/artpieces`, {
        headers: {
          "X-Token": localSession,
        },
      });
      if (response.status === 200) {
        return response.data;
      } else {
        return [];
      }
    } catch (e) {
      return [];
    }
  } else {
    return [];
  }
};

export const getArtpieceSale = async (): Promise<KeyValue[]> => {
  const localSession = localStorage.getItem("session");
  if (localSession) {
    try {
      const response = await axios.get(`/api/artpiecesale`, {
        headers: {
          "X-Token": localSession,
        },
      });
      if (response.status === 200) {
        return response.data;
      } else {
        return [];
      }
    } catch (e) {
      return [];
    }
  } else {
    return [];
  }
};

export const apiDownloadData = async (type: string): Promise<Blob | null> => {
  const localSession = localStorage.getItem("session");
  if (localSession) {
    try {
      const response = await axios.get(`/api/download`, {
        params: {
          type,
        },
        headers: {
          "X-Token": localSession,
        },
        responseType: "blob",
      });
      if (response.status === 200) {
        return response.data;
      } else {
        return null;
      }
    } catch (e) {
      return null;
    }
  } else {
    return null;
  }
};

export const apiGetReport = async (data: KeyValue): Promise<Blob | null> => {
  const localSession = localStorage.getItem("session");
  if (localSession) {
    try {
      const response = await axios.post(
        `/api/catalog`,
        {
          catalog: data.catalog,
          list: data.listId,
          selectedList: data.selectedList,
          fields: data.fields,
        },
        {
          headers: {
            "X-Token": localSession,
          },
          responseType: "blob",
        },
      );
      if (response.status === 200) {
        return response.data;
      } else {
        return null;
      }
    } catch (e) {
      return null;
    }
  } else {
    return null;
  }
};

export const getReports = async (): Promise<Reports[]> => {
  const localSession = localStorage.getItem("session");
  if (localSession) {
    try {
      const response = await axios.get(`/api/reports`, {
        headers: {
          "X-Token": localSession,
        },
      });
      if (response.status === 200) {
        return response.data;
      } else {
        return [];
      }
    } catch (e) {
      return [];
    }
  } else {
    return [];
  }
};

export const getShows = async (): Promise<Shows[]> => {
  const localSession = localStorage.getItem("session");
  if (localSession) {
    try {
      const response = await axios.get(`/api/shows`, {
        headers: {
          "X-Token": localSession,
        },
      });
      if (response.status === 200) {
        return response.data;
      } else {
        return [];
      }
    } catch (e) {
      return [];
    }
  } else {
    return [];
  }
};

export const apiSellPieces = async (data: KeyValue): Promise<boolean> => {
  const localSession = localStorage.getItem("session");
  if (localSession) {
    try {
      const response = await axios.post(`/api/sellpieces`, data, {
        headers: {
          "X-Token": localSession,
        },
      });
      if (response.status === 200) {
        return response.data;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  } else {
    return false;
  }
};

export const getCustomers = async (): Promise<Customer[]> => {
  const localSession = localStorage.getItem("session");
  if (localSession) {
    try {
      const response = await axios.get(`/api/customers`, {
        headers: {
          "X-Token": localSession,
        },
      });
      if (response.status === 200) {
        return response.data;
      } else {
        return [];
      }
    } catch (e) {
      return [];
    }
  } else {
    return [];
  }
};

export const getArtPiece = async (
  id: string,
): Promise<ArtPiece | undefined> => {
  const localSession = localStorage.getItem("session");
  if (localSession) {
    try {
      const response = await axios.get(`/api/artpiece`, {
        params: {
          id,
        },
        headers: {
          "X-Token": localSession,
        },
      });
      if (response.status === 200) {
        return response.data;
      } else {
        return undefined;
      }
    } catch (e) {
      return undefined;
    }
  } else {
    return undefined;
  }
};

export const getSelection = async (
  id: string,
): Promise<ArtSelection | undefined> => {
  const localSession = localStorage.getItem("session");
  if (localSession) {
    try {
      const response = await axios.get(`/api/selection`, {
        params: {
          id,
        },
        headers: {
          "X-Token": localSession,
        },
      });
      if (response.status === 200) {
        return response.data;
      } else {
        return undefined;
      }
    } catch (e) {
      return undefined;
    }
  } else {
    return undefined;
  }
};

export const apiGetShow = async (id: string): Promise<GeneralAPIError> => {
  const localSession = localStorage.getItem("session");
  if (localSession) {
    try {
      const response = await axios.get(`/api/show`, {
        params: {
          id,
        },
        headers: {
          "X-Token": localSession,
        },
      });
      if (response.status === 200) {
        return { error: false, response };
      } else {
        return { error: true, response };
      }
    } catch (e) {
      return { error: true, response: { e } };
    }
  } else {
    return { error: true, response: {} };
  }
};

export const apiGetCustomer = async (id: string): Promise<GeneralAPIError> => {
  const localSession = localStorage.getItem("session");
  if (localSession) {
    try {
      const response = await axios.get(`/api/customer`, {
        params: {
          id,
        },
        headers: {
          "X-Token": localSession,
        },
      });
      if (response.status === 200) {
        return { error: false, response };
      } else {
        return { error: true, response };
      }
    } catch (e) {
      return { error: true, response: { e } };
    }
  } else {
    return { error: true, response: {} };
  }
};

export const apiDeleteShow = async (id: string): Promise<Shows | undefined> => {
  const localSession = localStorage.getItem("session");
  if (localSession) {
    try {
      const response = await axios.delete(`/api/show`, {
        params: {
          id,
        },
        headers: {
          "X-Token": localSession,
        },
      });
      if (response.status === 200) {
        return response.data;
      } else {
        return undefined;
      }
    } catch (e) {
      return undefined;
    }
  } else {
    return undefined;
  }
};

export const apiDeleteCustomer = async (
  id: string,
): Promise<Customer | undefined> => {
  const localSession = localStorage.getItem("session");
  if (localSession) {
    try {
      const response = await axios.delete(`/api/customer`, {
        params: {
          id,
        },
        headers: {
          "X-Token": localSession,
        },
      });
      if (response.status === 200) {
        return response.data;
      } else {
        return undefined;
      }
    } catch (e) {
      return undefined;
    }
  } else {
    return undefined;
  }
};

export const apiDeleteSelection = async (
  id: string,
): Promise<ArtSelection | undefined> => {
  const localSession = localStorage.getItem("session");
  if (localSession) {
    try {
      const response = await axios.delete(`/api/selection`, {
        params: {
          id,
        },
        headers: {
          "X-Token": localSession,
        },
      });
      if (response.status === 200) {
        return response.data;
      } else {
        return undefined;
      }
    } catch (e) {
      return undefined;
    }
  } else {
    return undefined;
  }
};

export const apiRemoveFromSelection = async (data: {
  ids: string[];
  selectionId: string;
}): Promise<ArtSelection | undefined> => {
  const localSession = localStorage.getItem("session");
  if (localSession) {
    try {
      const response = await axios.patch(
        `/api/selection`,
        {
          ids: data.ids,
          selectionId: data.selectionId,
        },
        {
          headers: {
            "X-Token": localSession,
          },
        },
      );
      if (response.status === 200) {
        return response.data;
      } else {
        return undefined;
      }
    } catch (e) {
      return undefined;
    }
  } else {
    return undefined;
  }
};

export const getStatistics = async (): Promise<StatsData | undefined> => {
  const localSession = localStorage.getItem("session");
  if (localSession) {
    try {
      const response = await axios.get(`/api/statistics`, {
        headers: {
          "X-Token": localSession,
        },
      });
      if (response.status === 200) {
        return response.data;
      } else {
        return undefined;
      }
    } catch (e) {
      return undefined;
    }
  } else {
    return undefined;
  }
};

export const getSelections = async (): Promise<ArtSelection[] | undefined> => {
  const localSession = localStorage.getItem("session");
  if (localSession) {
    try {
      const response = await axios.get(`/api/selections`, {
        headers: {
          "X-Token": localSession,
        },
      });
      if (response.status === 200) {
        return response.data;
      } else {
        return undefined;
      }
    } catch (e) {
      return undefined;
    }
  } else {
    return undefined;
  }
};

export const apiSaveMediaToArtipiece = async (data: {
  selections: string[];
  artPieceId: string;
}): Promise<boolean> => {
  const localSession = localStorage.getItem("session");
  if (localSession) {
    try {
      const response = await axios.patch(
        `/api/addmediatoartpiece`,
        {
          selections: data.selections,
          artPieceId: data.artPieceId,
        },
        {
          headers: {
            "X-Token": localSession,
          },
        },
      );
      if (response.status === 200) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  } else {
    return false;
  }
};

export const saveNewList = async (
  selections: string[],
  name: string,
  selectionId: string,
): Promise<boolean> => {
  const localSession = localStorage.getItem("session");
  if (localSession) {
    try {
      const response = await axios.patch(
        `/api/selections`,
        {
          selections,
          name,
          selectionId,
        },
        {
          headers: {
            "X-Token": localSession,
          },
        },
      );
      if (response.status === 200) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  } else {
    return false;
  }
};

export const getMedia = async (): Promise<PictureDao[]> => {
  const localSession = localStorage.getItem("session");
  if (localSession) {
    try {
      const response = await axios.get(`/api/pictures`, {
        headers: {
          "X-Token": localSession,
        },
      });
      if (response.status === 200) {
        return response.data;
      } else {
        return [];
      }
    } catch (e) {
      return [];
    }
  } else {
    return [];
  }
};

export const apiGetFolders = async (): Promise<KeyValue> => {
  const localSession = localStorage.getItem("session");
  if (localSession) {
    try {
      const response = await axios.get(`/api/folders`, {
        headers: {
          "X-Token": localSession,
        },
      });
      if (response.status === 200) {
        return response.data;
      } else {
        return [];
      }
    } catch (e) {
      return [];
    }
  } else {
    return [];
  }
};

export const updateArtPiecesOrder = async (ids: string[]): Promise<boolean> => {
  const localSession = localStorage.getItem("session");
  if (localSession) {
    try {
      const response = await axios.post(
        `/api/orderartpieces`,
        { ids },
        {
          headers: {
            "X-Token": localSession,
          },
        },
      );
      if (response.status === 200) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  } else {
    return false;
  }
};

export const getStatus = (categories: Category[], status: string) => {
  const item = categories.filter((item) => item._id === status);
  if (Array.isArray(item) && item.length > 0) {
    return item[0].label;
  } else {
    return "";
  }
};

export const getArtType = (categories: Category[], type: string) => {
  const item = categories.filter((item) => item._id === type);
  if (Array.isArray(item) && item.length > 0) {
    return item[0].label;
  } else {
    return "";
  }
};

export const getObjectUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onerror = function (event) {
      reject();
    };
    fileReader.onload = function (event) {
      resolve(event.target?.result as string);
    };
    fileReader.readAsDataURL(file);
  });
};

export const showWaiting = () => {
  emitWaiting({ visible: true, start: Date.now() });
};

export const hideWaiting = () => {
  emitWaiting({ visible: false, start: Date.now() });
};

export const GetImage = (props: { file: File }) => {
  const [url, setUrl] = useState(pendingimage);

  useEffect(() => {
    getObjectUrl(props.file).then((url) => {
      setUrl(url);
    });
  }, [props.file]);

  return <img id="image" className="" src={url} />;
};

export const isValidEmail = (email: string) => {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return true;
  } else {
    return false;
  }
};

export const { useSelectRowListener, emitSelectRow } =
  createEvent("SelectRow")<string>();
export const { useSwapListener, emitSwap } = createEvent("Swap")<{
  source: string;
  destination: string;
}>();
export const { useItemOverListener, emitItemOver } =
  createEvent("ItemOver")<string>();
export const { useLoginListener, emitLogin } = createEvent("Login")<KeyValue>();
export const { useWaitingListener, emitWaiting } =
  createEvent("Waiting")<Timeout>();
export const { useErrorListener, emitError } = createEvent("Error")<string>();
export const { useStoreListener, emitStore } = createEvent("Store")<{
  key: string;
  value: Object;
  store?: boolean;
}>();
export const { useAppStateListener, emitAppState } =
  createEvent("AppState")<StoreContext>();
export const { useSwapOrderListener, emitSwapOrder } = createEvent(
  "SwapOrder",
)<{ source: string; destination: string }>();
export const { useAddMoreMediaListener, emitAddMoreMedia } = createEvent(
  "AddMoreMedia",
)<{ id: string }>();
export const { useFileDroppedListener, emitFileDropped } =
  createEvent("FileDropped")<KeyValue>();
