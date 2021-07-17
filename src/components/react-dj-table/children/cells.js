import { ACTIONS } from '../reducers/actions'
import PropTypes from "prop-types"
import React from "react"
import _ from 'lodash'
import {createMarkupLiteral} from '../utils/utils'

/**
 * Component for displaying cells in the Table.
 *
 * @component
 * 
 * const state= {...
  }
 * const row = {...
    
}
 * return (
 *   <Cells />
 * )
 */
const Cells=({ state,dispatch, row, editable})=>{
    const options = state.options 
    const styles = options.cellCss || ''
    const cssClasses = ` ${styles}`
    const customColArr = options.customCols || []
    const hiddenColArr = options.hiddenCols  || []
    const dateColArr = options.dateCols  || {}
    const dateOptions = options.dateOptions || {}
  
    const columns = Object.keys(row)


    const onChange = (e) => {
        var item = e.currentTarget.name.toString(); 
      if(e.currentTarget.type==='checkbox'){
        const { checked } = e.target
        dispatch({ type: ACTIONS.UPDATECHECKBOX, payload: { item: item,checked:checked  }})

      }else{
        var value=e.currentTarget.value
        dispatch({ type: ACTIONS.UPDATEROW, payload: { item: item,value:value  }})
      }
    }

    const createCells = (row) => {
        return columns.map((key) => {
            const isHidden = _.includes(hiddenColArr, key)
            const isCheckBox = typeof row[key] === "boolean"
            const isCustom = _.find(customColArr, key)
            const isDateCol = _.find(dateColArr, key)
            const locale= isDateCol ? dateColArr[key] :''
            if(editable){
                const editcssClasses = `editInputText ${styles}`
                if(isHidden) return null 
                if(isCheckBox && options.checkBox !== false) return <td  type="checkbox" className={cssClasses} key={key}> <input name={key} onChange={onChange}  type='checkbox' checked={row[key]}></input></td>  
                if(isCustom )  return <td className={editcssClasses} key={key}><input type="text" name={key}  onChange={onChange} value={row[key].toString()}></input>  </td> 
                if(isDateCol) return  <td className={editcssClasses} key={key}> <input type="text"  name={key}  onChange={onChange}  value={row[key].toString()}></input> </td>
                return <td className={editcssClasses} key={key}> <input name={key}  type="text" onChange={onChange} value={row[key].toString()}></input> </td>
            }
            // we need to test to determine the types
            // pref in some sort of performant order
            // testing for hidden colums first as we can just step out
            // if we match hidden
            if(isHidden) return null 

            // next test a bool type as it's quick and we can eliminate as effeciently as possible
            if(isCheckBox && options.checkBox !== false) return <td className={cssClasses} key={key}> <input readOnly type='checkbox' checked={row[key]}></input></td>  

            // Test if it's a custom type
            
            // the markup is sanitised and returned before being inserted into the dom
           
             if(isCustom )  return <td className={cssClasses} key={key} dangerouslySetInnerHTML={createMarkupLiteral(key, isCustom[key], row[key])}></td> 
                
          
               
            
            // Check if  date 
            // then go with the user options
            // get the locale is specified from options.dateOptions

            if(isDateCol) return  <td className={cssClasses} key={key}>{new Date(row[key]).toLocaleDateString(locale,dateOptions)}</td>

             //default return string 
           
            return <td className={cssClasses} key={key}>{row[key].toString()}</td>

        })
    }
    return (createCells(row))
}
Cells.propTypes = {
    /**
     * JSON object array json
     */
    /**
     * Table options
     */
    row: PropTypes.object,
}

Cells.defaultProps = {

    row: {
        
    }
}
export default Cells