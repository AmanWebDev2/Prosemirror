import React, { useState } from "react";
import applyMark from "./content-editable/utils/applyMark";
import { ENTER } from "./content-editable/utils/KeyCodes";
import sanitizeURL from "./content-editable/utils/santizeURL";
export const BAD_CHARACTER_PATTER = /\s/;

const LinkUrlEditor = (props) => {
  const [url, setUrl] = useState(() => props.href);
  const handleKeyDown = (e) => {
    if (e.keyCode === ENTER) {
      e.preventDefault();
      apply();
    }
  };

  const onURLChange = (e) => {
    const url = e.target.value;
    setUrl(url);
  };

  // const cancel = () => {
  //   props.closeCallback();
  // };

  const apply = () => {
    if (!BAD_CHARACTER_PATTER.test(url)) {
      // console.log(props)
      props.close(sanitizeURL(url),applyMark);
    }
  };

  return (
    <div className="kudoshub-prosemirror-composer-pointer czi-link-tooltip">
      <form className="czi-form" onSubmit={(e) => e.preventDefault()}>
        <div className=" flex flex-col gap-2">
          <div className="flex flex-col px-3 pt-3 gap-2">
            <div className="smartlinks-input-container ">
              <input
                placeholder="Paste a link or search for content"
                className="f__text pr-8 "
                type="text"
                autoFocus={true}
                onChange={onURLChange}
                onKeyDown={handleKeyDown}
                spellCheck={false}
                value={url || ""}
              />
              <div className="absolute right-1 z-10">
                <button
                  className="kudoshub-prosemirror-composer-icon-btn
                   flex content-start kudoshub-prosemirror-template-inserter-opener"
                  data-test-open-template-inserter=""
                  type="button"
                >
                  <svg
                    className="interface-icon o__standard o__standard__custom-data"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M4.09163 3.75C3.86443 3.75 3.50693 3.82433 3.22778 4.02532C2.98687 4.19877 2.7583 4.49444 2.7583 5.08333V5.91667C2.7583 6.28386 2.67964 6.83073 2.44028 7.35376C2.34126 7.57013 2.20887 7.79381 2.03531 8C2.20887 8.20619 2.34126 8.42987 2.44028 8.64624C2.67964 9.16927 2.7583 9.71614 2.7583 10.0833V10.9167C2.7583 11.5056 2.98687 11.8012 3.22778 11.9747C3.50693 12.1757 3.86443 12.25 4.09163 12.25V13.75C3.62439 13.75 2.94023 13.616 2.35132 13.192C1.72417 12.7404 1.2583 11.9944 1.2583 10.9167V10.0833C1.2583 9.89497 1.21197 9.56684 1.07632 9.27043C0.944074 8.98145 0.762467 8.79196 0.52113 8.71151C0.214873 8.60943 0.00830078 8.32282 0.00830078 8C0.00830078 7.67718 0.214873 7.39057 0.52113 7.28849C0.762467 7.20804 0.944074 7.01855 1.07632 6.72957C1.21197 6.43316 1.2583 6.10503 1.2583 5.91667V5.08333C1.2583 4.00556 1.72417 3.25956 2.35132 2.80802C2.94023 2.384 3.62439 2.25 4.09163 2.25V3.75Z"></path>
                    <path d="M12.7671 4.02532C12.488 3.82433 12.1305 3.75 11.9033 3.75V2.25C12.3705 2.25 13.0547 2.384 13.6436 2.80802C14.2707 3.25956 14.7366 4.00556 14.7366 5.08333V5.91667C14.7366 6.10503 14.7829 6.43316 14.9186 6.72957C15.0508 7.01855 15.2324 7.20804 15.4738 7.28849C15.78 7.39057 15.9866 7.67718 15.9866 8C15.9866 8.32282 15.78 8.60943 15.4738 8.71151C15.2324 8.79196 15.0508 8.98145 14.9186 9.27043C14.7829 9.56684 14.7366 9.89497 14.7366 10.0833V10.9167C14.7366 11.9944 14.2707 12.7404 13.6436 13.192C13.0547 13.616 12.3705 13.75 11.9033 13.75V12.25C12.1305 12.25 12.488 12.1757 12.7671 11.9747C13.008 11.8012 13.2366 11.5056 13.2366 10.9167V10.0833C13.2366 9.71614 13.3153 9.16927 13.5546 8.64624C13.6536 8.42987 13.786 8.20619 13.9596 8C13.786 7.79381 13.6536 7.57013 13.5546 7.35376C13.3153 6.83073 13.2366 6.28386 13.2366 5.91667V5.08333C13.2366 4.49444 13.008 4.19877 12.7671 4.02532Z"></path>
                    <path d="M6.10009 9.25C6.79045 9.25 7.35009 8.69036 7.35009 8C7.35009 7.30964 6.79045 6.75 6.10009 6.75C5.40974 6.75 4.85009 7.30964 4.85009 8C4.85009 8.69036 5.40974 9.25 6.10009 9.25Z"></path>
                    <path d="M9.89978 9.25C10.5901 9.25 11.1498 8.69036 11.1498 8C11.1498 7.30964 10.5901 6.75 9.89978 6.75C9.20942 6.75 8.64978 7.30964 8.64978 8C8.64978 8.69036 9.20942 9.25 9.89978 9.25Z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="smart-links__list flex flex-col overflow-auto -mx-1">
            <div className="smart-links-wrapper hover:text-blue hover:bg-blue-light cursor-pointer flex flex-row items-center px-4 py-2 gap-4">
              <div style={{
                marginRight:'16px'
              }}>
                <svg
                  className="kudoshub-icon o__standard o__standard__link o__by-text"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.36014 4.01432C10.0436 3.3309 11.1516 3.3309 11.835 4.01432L12.0796 4.25896C12.8412 5.02048 12.8412 6.25515 12.0796 7.01667L10.3276 8.76868C9.64422 9.4521 8.53618 9.4521 7.85276 8.76868L7.65973 8.57565C7.32779 8.24371 6.7896 8.24371 6.45765 8.57565C6.12571 8.9076 6.1257 9.44579 6.45765 9.77774L6.65068 9.97076C7.99799 11.3181 10.1824 11.3181 11.5297 9.97076L13.2817 8.21875C14.7071 6.79334 14.7071 4.48229 13.2817 3.05687L13.0371 2.81224C11.6898 1.46493 9.50536 1.46493 8.15806 2.81224L8.1237 2.8466C7.79175 3.17854 7.79175 3.71674 8.1237 4.04868C8.45564 4.38063 8.99383 4.38063 9.32578 4.04868L9.36014 4.01432ZM6.64006 11.9854C5.95665 12.6688 4.84861 12.6688 4.16519 11.9854L3.92055 11.7407C3.15903 10.9792 3.15903 9.74455 3.92056 8.98303L5.67257 7.23102C6.35599 6.5476 7.46402 6.5476 8.14744 7.23102L8.34047 7.42405C8.67241 7.75599 9.2106 7.75599 9.54255 7.42405C9.8745 7.0921 9.8745 6.55391 9.54255 6.22197L9.34952 6.02894C8.00221 4.68163 5.81779 4.68163 4.47049 6.02894L2.71848 7.78095C1.29306 9.20636 1.29306 11.5174 2.71847 12.9428L2.96311 13.1875C4.31042 14.5348 6.49484 14.5348 7.84214 13.1875L7.8765 13.1531C8.20845 12.8212 8.20845 12.283 7.8765 11.951C7.54456 11.6191 7.00637 11.6191 6.67442 11.951L6.64006 11.9854Z"
                  ></path>
                </svg>
              </div>
              <div className="flex flex-col flex-1 u__one-truncated-line">
               {url}
              </div>
            </div>

            <div className="smart-links__list-two flex flex-row items-center gap-1 text-sm pl-4 py-1 h-9">
              <span className="text-blue"
              style={{
                marginRight:'16px'
              }}
              >
                <svg
                  className="kudoshub-icon o__standard o__standard__trigger o__by-text"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3.19506 9.00032C2.57142 9.00032 2.25911 8.24632 2.70008 7.80534L9.65784 0.847587C10.1642 0.341177 11.0143 0.831968 10.829 1.52374L9.53016 6.37091C9.44507 6.68847 9.68436 7.00032 10.0131 7.00032L12.921 7.00032C13.5273 7.00032 13.8469 7.71872 13.4409 8.16905L7.3274 14.9499C6.84112 15.4893 5.95654 15.0227 6.12707 14.3168L7.26227 9.61773C7.33827 9.30313 7.0999 9.00032 6.77625 9.00032H3.19506Z"
                  ></path>
                </svg>
              </span>
              <span className="text-blue">Smart Links</span>
              <span className="text-gray">
                - Use this link to trigger other content from your library
              </span>
            </div>

            <div className="smart-links-info flex flex-row items-center px-4 gap-4 h-8">
              <div className="decoration__line w-px bg-gray ml-2 h-6 mb-2"></div>
              <div className="text-gray"
              style={{
                marginRight:'16px'
              }}
              >
                <svg
                  className="interface-icon o__standard o__standard__error"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15ZM10.8284 6.23186C11.1213 5.93897 11.1213 5.46409 10.8284 5.1712C10.5355 4.87831 10.0607 4.87831 9.76777 5.1712L8 6.93897L6.23223 5.1712C5.93934 4.87831 5.46447 4.87831 5.17157 5.1712C4.87868 5.46409 4.87868 5.93897 5.17157 6.23186L6.93934 7.99963L5.17157 9.76739C4.87868 10.0603 4.87868 10.5352 5.17157 10.8281C5.46447 11.1209 5.93934 11.1209 6.23223 10.8281L8 9.06029L9.76777 10.8281C10.0607 11.1209 10.5355 11.1209 10.8284 10.8281C11.1213 10.5352 11.1213 10.0603 10.8284 9.76739L9.06066 7.99963L10.8284 6.23186Z"
                  ></path>
                </svg>
              </div>
              <div className="flex flex-col flex-1 u__one-truncated-line text-gray">
                You don't have any live content matching &nbsp;
                {url}
              </div>
            </div>
          </div>
        </div>
        
      </form>
    </div>
  );
};

export default LinkUrlEditor;
