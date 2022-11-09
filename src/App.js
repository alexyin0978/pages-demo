import { useEffect, useState } from "react";


const App = () => {

  // select 目前顯示數量
  const [displayCount, setDisplayCount] = useState(5);
  // 一頁最多顯示數量, 固定
  const [displayLimit, setDisplayLimit] = useState(10);
  // 完整資料, 不去動它
  const [originalData, setOriginalData] = useState(null);
  // 用來儲存filter後的資料
  // 格式為[[page1], [page2], [page3]] -> arr裡面裝pageArr, pageArr裡面裝itemObj
  const [dataDisplay, setDataDisplay] = useState(null);
  // 實際顯示用的ui data, 用currentPage去讀取dataDisplay
  // [item1, item2, item3, ...]
  const [pageData, setPageData] = useState(null);
  // currentPage
  const [currentPage, setCurrentPage] = useState(1);

  const fetchJsonApi = async () => {
    try {
      const resp = await fetch('https://jsonplaceholder.typicode.com/albums');
      const data = await resp.json();
      setOriginalData(data)
      // 一fetch完成, 就先filter
      setDataDisplay([[...handleFilter(data)]]);

    } catch (err) {
      console.log(err);
    }
  }
  
  // console.log('dataDisplay:', dataDisplay);
  // console.log('pageData:', pageData);

  useEffect(() => {
    fetchJsonApi();
  }, []);

  // 監聽displayCount, 重新filter originalData, 重設displayData
  useEffect(() => {
    if(!!originalData){
      const temp = handleFilter(originalData);
      const chunksResult = splitArrIntoChunk(temp, displayLimit, currentPage)
      setDataDisplay([...chunksResult]);
      // [Arr10, Arr10, Arr4]
    }
  }, [displayCount]);

  // 監聽currentPage, 換頁則更換pageData內容
  useEffect(() => {
    if(!!dataDisplay && !!dataDisplay.length){
      setPageData([...dataDisplay[currentPage - 1]]);
    }
  }, [currentPage, dataDisplay]);

  const handleFilter = (arr) => {
    const newArr = arr.filter((_, idx) => idx < displayCount);
    return newArr;
  };

  const splitArrIntoChunk = (arr, limitation) => {
    const result = [];
    for(let i = 0; i < arr.length; i += limitation){
      const chunk = arr.slice(i, i + limitation);
      result.push(chunk);
    }
    return result;
  };

  const handleSelect = (evt) => {
    const {value} = evt.target;
    setDisplayCount(value);
  }

  const selectOptions = [
    {
      id: 0,
      value: 5,
      label: 5,
    },
    {
      id: 1,
      value: 10,
      label: 10,
    },
    {
      id: 2,
      value: 15,
      label: 15,
    },
    {
      id: 3,
      value: 24,
      label: 'All',
    },
  ];

  const handlePageSwitch = (evt) => {
    const {value} = evt.target;
    setCurrentPage(Number(value));
  }
  
  return (
    <div className="App">
      <div>
        <select onChange={handleSelect}>
          {
            selectOptions.map(option => (
              <option value={option.value} key={option.id}>{option.label}</option>
            ))
          }
        </select>
      </div>
      <div className="data">
        {
          !!pageData && pageData.map(data => (
            <div key={data.id}>{data.title}</div>
          ))
        }
      </div>
      <div>
        {
          !!dataDisplay && dataDisplay[0].length > 5 && dataDisplay.map((_, idx) => {
            return (
              <button 
              key={idx} 
              value={idx + 1} 
              onClick={handlePageSwitch} 
              style={{background: `${currentPage === (idx + 1) ? "red" : "green"}`}}
              >
                {idx + 1}
              </button>
            )
          })
        }
      </div>
    </div>
  );
}

export default App;
