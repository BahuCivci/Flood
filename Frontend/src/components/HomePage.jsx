import React, { useState } from "react";

import { Typography, Row, Col, Statistic } from "antd";
import { Select } from "antd";
import { Link } from "react-router-dom";

import { useGetStationRiverNameQuery, useGetValueFromStationReferenceQuery, useGetStationByQualifierQuery} from "../services/floodApi";
import { useEffect } from "react";
import RiverLabelData from "./riverData";
import GroundwaterAndTidalData from "./GroundwaterAndTidalData";
import Loader from "./Loader";

const { Text, Title } = Typography;
const { Option } = Select;

const HomePage = () => {
  const[qualifier, setQualifier] = useState('')
  const [stations, setStations] = useState([])
  const [river, setRiver] = useState('');
  const [allRivers, setAllRivers] = useState(new Set);
  const { data: stationInfoFromRiver, isFetching } = useGetStationRiverNameQuery('');
  // console.log(stationInfoFromRiver)

  let {
    data: selectedRiver, isFetching: fetchingRiverInformation,
  } = useGetStationRiverNameQuery(river, { skip: river === "" });

  const { data: groundWaterAndTidal , isFetching:fetchingTidalAndGroundWater} = useGetStationByQualifierQuery(qualifier, { skip: qualifier === "" });

  const onChange = (value) => {
    console.log(`selected ${value}`);
    setRiver(value);
  };

  const onSearch = (value) => {
    console.log('search:', value);
  };

  const onChangeQualifier = (value) => {
    setQualifier(value)
    
  };

  const onSearchQualifier = (value) => {
    console.log('search:', value);
  };
    
  const grounwaterAndTidalInfo = groundWaterAndTidal?.items.map((item, index) => {
    return <GroundwaterAndTidalData index={index} item={item} />;
  });

  const labelInfo = selectedRiver?.items.map((item, index) => {
    return <RiverLabelData index={index} item={item} />;
  });

  if (isFetching) {
    return <Loader/>;
  } else if (allRivers.size === 0) {
    let rivers = new Set;
    stationInfoFromRiver?.items.map((item,index) => {
      if (item.riverName !== undefined) {
        rivers.add(item.riverName);
      }
    });
    setAllRivers(rivers);
  }

  return (
    <>
      <Title level={2} className='heading'>Flood Stats</Title>
      <Row>
        <Col span={12}><Statistic title="The Number of Rivers" value={allRivers.size} /></Col>
        <Col span={12}><Statistic title="The Number of Stations" value={stationInfoFromRiver?.items.length} /></Col>
      </Row>
      <div className="home-heading-container">
        <Title level={2} className="home-title">Rivers, Groundwater and Tidal Level In the UK</Title>
        <Title level={3} className="show-more"><Link to="/map-view">Show more</Link></Title>
      </div>



      <div className="home-heading container">
        <Title level={2} className='home-title' />
      </div>
      <div>
        <Col>
          <Select
            showSearch
            placeholder="Select a river"
            optionFilterProp="children"
            onChange={onChange}
            onSearch={onSearch}
            listHeight={330}

          >
            {Array.from(allRivers).map((item) => (
              <Option key={item} value={item}>
                {item}
              </Option>
            ))}


          </Select> <br></br><br></br>
          <Select
            showSearch
            placeholder="Select a type"
            optionFilterProp="children"
            onChange={onChangeQualifier}
            onSearch={onSearchQualifier}
            listHeight={330}

          >
            <Option value="Groundwater">Groundwater</Option>
            <Option value="Tidal Level">Tidal Level</Option>
            


          </Select>

        </Col>
        <Row>{river && <Title>Selected River Stations<br /></Title>}</Row>
        <Row gutter={[24, 24]}>
          {fetchingRiverInformation ? <Loader/>  : labelInfo}
        </Row>
        <Row>{qualifier && <Title>{qualifier} Stations<br /></Title>}</Row>
        <Row gutter={[24, 24]}>
          
          {fetchingTidalAndGroundWater ? <Loader/> : grounwaterAndTidalInfo}
        </Row>
      </div>

    </>
  );
}

export default HomePage;
