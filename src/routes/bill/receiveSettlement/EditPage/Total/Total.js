import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Total.less';
import {Card, Control} from '../../../../../components';

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
    const currency = item.currencyTypeCode;
    const company = item.balanceCompanyGuid.title;
    const index = result.label.findIndex(item => item.company === company);
    if (index > -1) {
      if (typeof result.net[index][currency] !== 'undefined') {
        result.net[index][currency] += item.netAmount;
        result.tax[index][currency] += Number(item.netAmount + item.taxAmount);
      } else {
        insertCurrency(result.label[index].currency, currency);
        result.net[index][currency] = item.netAmount;
        result.tax[index][currency] = Number(item.netAmount + item.taxAmount);
      }
    } else {
      result.label.push({company, currency: [currency]});
      result.net.push({[currency]: item.netAmount});
      result.tax.push({[currency]: item.netAmount + item.taxAmount});
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
    const {currencyList, onCurrencyChange, totalKeys, activeCurrency, totalValues} = this.props;
    const selectProps = {
      options: currencyList,
      value: activeCurrency,
      onChange: onCurrencyChange,
      allowClear: false,
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
    const {label, net, tax} = calTotalByCompany(this.props.receiveItems);
    return (
      <Card className={s.root} role='total'>
        {this.totalHead()}
        <table>
          <tbody>
            {this.totalRow(label, tax, '含税总额')}
            {this.totalRow(label, net, '净价总额')}
          </tbody>
        </table>
      </Card>
    )
  }
}

export default withStyles(s)(Total);
