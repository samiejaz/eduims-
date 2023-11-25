import { Tabs, Tab } from "react-bootstrap";
import { useContext } from "react";
import { ActiveKeyContext } from "../context/ActiveKeyContext";
import { BsSearch, BsPlusCircle } from "react-icons/bs";

function TabHeader({ Search, Entry, SearchTitle, EntryTitle }) {
  const { key, setKey } = useContext(ActiveKeyContext);
  return (
    <>
      <div className="bg__image">
        <div className=" px-md-5 bg__image">
          <div className=" px-md-4">
            <Tabs
              id="controlled-tab-example"
              activeKey={key}
              defaultActiveKey={"search"}
              className="mt-3"
              onSelect={(k) => setKey(k)}
            >
              <Tab
                eventKey={"search"}
                title={
                  <span>
                    <BsSearch />
                    Search
                  </span>
                }
              >
                <div className="mt-5">{Search}</div>
              </Tab>

              <Tab
                eventKey={"entry"}
                title={
                  <span>
                    <BsPlusCircle /> Entry
                  </span>
                }
              >
                <div className="mt-4">{Entry}</div>
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}

export default TabHeader;
