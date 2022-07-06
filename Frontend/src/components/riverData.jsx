import React from "react";
import { Select, Typography, Row, Col, Avatar, Card } from 'antd';
import { useGetValueFromStationReferenceQuery} from "../services/floodApi";
import Loader from "./Loader";
const { Text, Title } = Typography;
const { Option } = Select;

const   RiverLabelData = (props) => {

  let {
    data: selectedStationRef, isFetching: fetchingValueInformation,
  } = useGetValueFromStationReferenceQuery(props.item.stationReference);

  // console.log(props)
  if (fetchingValueInformation) {
    return <Loader/>;
  } else {
    const dataLength = selectedStationRef.items.length
    let range = 'N/A';
    let dateTime = 'N/A';
    let parameterName = 'Water Level';
    let rangeStr = 'Data not available';

    if (dataLength !== 0) {
      for (let i = 0; i < dataLength; i++) {
        if (selectedStationRef.items[i].latestReading) {
          range = selectedStationRef.items[i].latestReading.value;
          dateTime = selectedStationRef?.items[i].latestReading?.dateTime;
          parameterName = selectedStationRef?.items[i]?.parameterName;
          break;
        }
      }
      rangeStr = 'normal';
      if (range < props.item.stageScale.typicalRangeLow) {
        rangeStr = 'low';
      } else if (range > props.item.stageScale.typicalRangeHigh) {
        rangeStr = 'high';
      }
    }

    return (
      // <div key={props.index}>
      //   <span>
      //     {props.item.label}
      //   </span>
      //   {'          '}
      //   <span>{range}</span>
      //   {'          '}
      //   <b>{rangeStr}</b>
      // </div>
 
      <Col xs={24} sm={12} lg={8} key={props.index}>
        
      <Card hoverable className="news-card">

          <div>
            <Title className="news-title" level={4}>{props.item.label}</Title>
          </div> <br></br>

          <div> 
            <h3>{parameterName}: {range}m</h3> <br></br>
            <h3> Status: {rangeStr}</h3> <br></br>
            <Text>Updated {dateTime?.slice(11,16) || null}, {dateTime?.slice(0,10) || null}</Text>
          </div>       
          
        
      </Card>
    </Col> 

   
    );
  }
}

export default RiverLabelData;