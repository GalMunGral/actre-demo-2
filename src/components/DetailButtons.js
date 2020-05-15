import React, { useContext } from "react";
import { useNavigate, useParams } from "@reach/router";
import { StoreContext } from "../contexts";
import IconButton from "./IconButton";
import { faArrowLeft, faTrash } from "@fortawesome/free-solid-svg-icons";

const DetailButtons = () => {
  const { folder, id } = useParams();
  const { dispatch, T } = useContext(StoreContext);
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const deleteMail = () => {
    navigate("./");
    dispatch((d) => {
      setTimeout(
        () =>
          d({
            type: T.DELETE,
            payload: { id, folder },
          }),
        200
      );
    });
  };

  return (
    <>
      <IconButton onClick={goBack} icon={faArrowLeft} />
      {folder !== "trash" && <IconButton onClick={deleteMail} icon={faTrash} />}
    </>
  );
};

export default DetailButtons;
