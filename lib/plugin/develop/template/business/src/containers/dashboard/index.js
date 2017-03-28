'use strict';

import React from 'react';
import {connect} from 'react-redux';
import './index.scss';
import {Button} from '@alife/next';
import {loadData} from '../../actions/dashboard';

const merge = Object.assign;
const defaultDomProps={

};

class dashboard extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {

  }

  render() {
    const {dashboard} = this.props;
    let domProps = merge({}, defaultDomProps, this.props.domProps);
        // console.log('1dashboard.get rec', recListData);

    return (
            <div className="dashboard-container">
                <Button type="normal" onClick={() => {
                  this.props.loadData();
                }}>加载数据1</Button>
            </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {
  };
};

export default connect(
    mapStateToProps,
  {
    loadData
  }
)(dashboard);
