// ./plugins/colorpicker/admin/src/components/colorPicker/index.js

import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Select, Button } from '@buffetjs/core';
import { request } from 'strapi-helper-plugin';

const Wrapper = styled.div`
  display: flex;
`;

const ContentPicker = (props) => {
  const [collectionValue, setCollection] = useState('Articles');
  const [options, setOptions] = useState(['Articles', 'Landingpages'])
  const [val, setValue] = useState('');
  const [shouldFetch, setShouldFetch] = useState(true);
  const [pick, setPick] = useState('test');
  const [pickable, setPickable] = useState([]);

  useEffect(() => {
    const getContent = async () => {
      const requestUrl = `/${collectionValue}?_q=${val}`

      try {
        const data = await request(requestUrl);
        setPickable(data.map((page) => {
          return {
            value: page.id,
            label: page.title,
          }
        }))
        setPick(data[0].id)
      } catch(e) {
        console.log(e);
      }
    }

    setShouldFetch(false);
    getContent();
  }, [shouldFetch])

  /**
   * Makes the color value available to the document for database update
   * @param {string} colorValue - in hex format
   */
  const updateContentValue = (pick) => {
    console.log(pick);
    props.onChange({ target: { name: 'content', value: pick } });
  };

  return (
    <Wrapper>
      <Select
        name="select"
        onChange={({ target: { value } }) => {
          setCollection(value)
          setShouldFetch(true);
        }}
        options={options}
        value={collectionValue}
      />
      {pickable && 
          <Select
          name="select"
          onChange={({ target: { value } }) => {
            setPick(value);
          }}
          options={pickable}
          value={pick}
        />
      }
      <Button color="primary" label="Save" onClick={() => updateContentValue(pick)} />
    </Wrapper>
  );
};

export default ContentPicker;
