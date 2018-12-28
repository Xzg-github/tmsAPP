import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Total.less';
import {Indent, Control} from '../../../../../components';

// const calTotal = (items) => {
//   return items.reduce((result, item) => {
//     const {amount=0, netAmount=0, exchangeRate=1} = item;
//     result.net += netAmount * exchangeRate;
//     result.tax += amount * exchangeRate;
//     return result;
//   }, {net: 0, tax: 0});
// };

const insertCurrency = (arr, currency) => {
  switch (currency) {
    case 'CNY': {
      arr.unshift(currency);
      break;
    }
    case 'USD': {
      if (arr.includes('CNY')) {
        arr.splice(1, 0, currency);
      } else {
        arr.unshift(currency);
      }
      break;
    }
    default: {
      arr.push(currency);
    }
  }
};

const calTotalByCompany = (items=[]) => {
  return items.reduce((result, item) => {
    const {currency, netAmount=0, taxAmount=0} = item;
    const company = item.companyTitle;
    const index = result.label.findIndex(o => o.company === company);
    if (index > -1) {
      if (typeof result.net[index][currency] !== 'undefined') {
        result.net[index][currency] += netAmount;
        result.tax[index][currency] += Number(netAmount + taxAmount);
      } else {
        insertCurrency(result.label[index].currency, currency);
        result.net[index][currency] = netAmount;
        result.tax[index][currency] = Number(netAmount + taxAmount);
      }
    } else {
      result.label.push({company, currency: [currency]});
      result.net.push({[currency]: netAmount});
      result.tax.push({[currency]: netAmount + taxAmount});
    }
    return result;
  }, {label: [], net: [], tax: []});
};

class Total extends React.Component {
  static propTypes = {
    activeCurrency: PropTypes.string,
    currencyList: PropTypes.array,
    totalKeys: PropTypes.array,
    totalValues: PropTypes.object,
    onCurrencyChange: PropTypes.func
  }

  totalHead = () => {
    const {currencyList, onCurrencyChange, totalKeys, activeCurrency, totalValues, isReadonly} = this.props;
    const selectProps = {
      options: currencyList,
      value: activeCurrency,
      onChange: onCurrencyChange,
      allowClear: false,
      disabled: isReadonly,
      type: 'select',
      size: 'small',
      style: { width: 60 }
    };
    return (
      <div>
        <Control {...selectProps}/>
        {totalKeys.map(({key, title}, index) => {
          if (typeof totalValues[key] !== 'undefined') {
            return [
              <span key={key}>{`${title}:`}</span>,
              <span key={index} data-role='money'>{Number(totalValues[key]).toFixed(2)}</span>
            ]
          }
        })}
      </div>
    );
  }

  totalRow = (label, data, title) => {
    return (
      <tr>
        <th data-role='head'>{title}</th>
        {label.map((col, index) => {
          const money = data[index];
          const key = index * (col.currency.length + 1);
          const result = [<td key={key} data-role='company'>{`${col.company}:`}</td>];
          col.currency.some((value, index) => {
            result.push(<td key={key + index + 1} data-role='money'>{`${value}${Number(money[value]).toFixed(2)}`}</td>);
            return false;
          });
          return result;
        })}
      </tr>
    );
  };

  render () {
    const {label, net, tax} = calTotalByCompany(this.props.items);
    return (
      <Indent className={s.root} role='total'>
        {this.totalHead()}
        <table>
          <tbody>
            {this.totalRow(label, tax, '含税总额')}
            {this.totalRow(label, net, '净价总额')}
          </tbody>
        </table>
      </Indent>
    )
  }
}

export default withStyles(s)(Total);
