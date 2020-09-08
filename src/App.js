import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Layout } from "antd";
import "antd/dist/antd.css";
import { Input, Button, Spin } from "antd";
import { UserOutlined } from "@ant-design/icons";

import "./App.css";
import CardComponent from "./components/Card/Card";
import * as actions from "./Redux/Action/action";

function App(props) {
  const [userName, setUserName] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    if (props && props.data && props.data.profileSummaryData) {
      const data = props && props.data && props.data.profileSummaryData;
      let allUsers = [...userName];
      allUsers.push({
        userName: text,
        followers: data && data.followers,
        following: data && data.following,
        repo: data && data.public_repos,
        gist: data && data.public_gists,
      });
      allUsers.sort(function (a, b) {
        return +a.followers - +b.followers;
      });
      setUserName(allUsers);
      setText("");
      setLoading(false);
    }
  }, [props && props.data && props.data.profileSummaryData]);

  useEffect(() => {
    if (props && props.data && props.data.error) {
      setError(true);
      setLoading(false);
    }
  }, [props && props.data && props.data.error]);
  const [error, setError] = useState("");

  const addUserToCard = (user) => {
    setLoading(true);
    props.fetchProfileSummary(user);
  };
  const { Header, Footer, Content } = Layout;

  const onChangeHandler = (e) => {
    if (e && e.target && e.target.value) {
      setText(e.target.value.replace(/^\s+/, ""));
    }
    if (e && e.target && !e.target.value) {
      setText("");
    }
  };

  const handleClick = () => {
    text && addUserToCard(text);
  };
  return (
    <div className="App">
      <Layout>
        <Header className="header">GitHub Compare Web App</Header>
        <Content className="content">
          <Input
            className="input"
            size="large"
            placeholder="Enter the GitHub username"
            value={text}
            onChange={onChangeHandler}
            prefix={<UserOutlined />}
          />
          <Button type="primary" className="btn" onClick={handleClick}>
            Compare User
          </Button>
          {error && <p className="error">Something went wrong</p>}
          {userName && userName.length > 0 && (
            <h2 className="heading">Profile Card List</h2>
          )}
          {isLoading ? (
            <Spin className="loader" />
          ) : (
            <div className="cardWrapper">
              {userName &&
                userName.length > 0 &&
                userName.map((item, index) => {
                  return (
                    <CardComponent
                      key={index}
                      className="cardComponent"
                      userName={item.userName}
                      following={item.following}
                      followers={item.followers}
                      repo={item.repo}
                      gist={item.gist}
                    />
                  );
                })}
            </div>
          )}
        </Content>
        <Footer className="footer">Footer</Footer>
      </Layout>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    data: state,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchProfileSummary: (userName) =>
      dispatch(actions.fetchProfileSummaryStart(userName)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
