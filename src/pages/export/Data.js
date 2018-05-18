import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import {
  FormBase,
  CTX_DEFAULT,
  CTX_MORE_OPTIONS,
  TYPE_DATE,
  TYPE_RADIO,
  TYPE_ORG_UNIT,
  TYPE_MORE_OPTIONS,
  TYPE_DATASET_PICKER
} from 'components'
import { today } from 'helpers'
import { getInstance } from 'd2/lib/d2'

export class DataExport extends FormBase {
  static path = '/export/data'

  static order = 7
  static title = i18n.t('Data Export')
  static description = i18n.t(
    'Export data values. This is the regular export function which exports data to the DHIS 2 exchange format called DXF 2.'
  )

  static contextTypes = {
    d2: PropTypes.object
  }

  formWidth = 600
  formTitle = i18n.t('Data Export')
  submitLabel = i18n.t('Export')

  fields = [
    {
      context: CTX_DEFAULT,
      type: TYPE_ORG_UNIT,
      name: 'orgUnit',
      label: i18n.t('Organisation unit')
    },
    {
      context: CTX_DEFAULT,
      type: TYPE_DATASET_PICKER,
      name: 'selectedDataSets',
      label: i18n.t('Data Sets')
    },
    {
      context: CTX_DEFAULT,
      type: TYPE_DATE,
      name: 'startDate',
      label: i18n.t('Start date')
    },
    {
      context: CTX_DEFAULT,
      type: TYPE_DATE,
      name: 'endDate',
      label: i18n.t('End date')
    },
    {
      context: CTX_DEFAULT,
      type: TYPE_RADIO,
      name: 'exportFormat',
      label: i18n.t('Format')
    },
    {
      context: CTX_DEFAULT,
      type: TYPE_RADIO,
      name: 'compression',
      label: i18n.t('Compression')
    },
    {
      context: CTX_DEFAULT,
      type: TYPE_MORE_OPTIONS
    },
    {
      context: CTX_MORE_OPTIONS,
      type: TYPE_RADIO,
      name: 'dataElementIdScheme',
      label: i18n.t('Data element ID scheme')
    },
    {
      context: CTX_MORE_OPTIONS,
      type: TYPE_RADIO,
      name: 'orgUnitIdScheme',
      label: i18n.t('Org unit ID scheme')
    },
    {
      context: CTX_MORE_OPTIONS,
      type: TYPE_RADIO,
      name: 'categoryOptionComboIdScheme',
      label: i18n.t('Category ID scheme')
    }
  ]

  state = {
    orgUnit: {
      selected: [],
      value: null
    },
    selectedDataSets: {
      selected: [],
      value: null
    },
    startDate: {
      selected: today()
    },
    endDate: {
      selected: today()
    },
    exportFormat: {
      selected: 'json',
      values: [
        {
          value: 'json',
          label: i18n.t('JSON')
        },
        {
          value: 'xml',
          label: i18n.t('XML')
        },
        {
          value: 'csv',
          label: i18n.t('CSV')
        }
      ]
    },
    compression: {
      selected: 'zip',
      values: [
        {
          value: 'zip',
          label: i18n.t('Zip')
        },
        {
          value: 'none',
          label: 'Uncompressed'
        }
      ]
    },
    dataElementIdScheme: {
      selected: 'UID',
      values: [
        {
          value: 'UID',
          label: i18n.t('UID')
        },
        {
          value: 'CODE',
          label: i18n.t('Code')
        },
        {
          value: 'NAME',
          label: i18n.t('Name')
        }
      ]
    },
    orgUnitIdScheme: {
      selected: 'UID',
      values: [
        {
          value: 'UID',
          label: i18n.t('UID')
        },
        {
          value: 'CODE',
          label: i18n.t('Code')
        },
        {
          value: 'NAME',
          label: i18n.t('Name')
        },
        {
          value: 'ATTRIBUTE:UKNKz1H10EE',
          label: i18n.t('HR identifier')
        }
      ]
    },
    categoryOptionComboIdScheme: {
      selected: 'UID',
      values: [
        {
          value: 'UID',
          label: i18n.t('UID')
        },
        {
          value: 'CODE',
          label: i18n.t('Code')
        }
      ]
    }
  }

  async componentDidMount() {
    await this.fetch()
  }

  async fetch() {
    try {
      const d2 = await getInstance()
      const orgUnitTree = await d2.models.organisationUnits
        .list({
          level: 1,
          paging: false,
          fields: 'id,path,displayName,children::isNotEmpty'
        })
        .then(root => root.toArray()[0])

      const dataSets = await d2.models.dataSet
        .list({ paging: false, fields: 'id,displayName' })
        .then(collection => collection.toArray())
        .then(sets =>
          sets.map(dataSet => ({
            value: dataSet.id,
            label: dataSet.displayName
          }))
        )

      this.setState({
        orgUnit: {
          selected: [],
          value: orgUnitTree
        },
        selectedDataSets: {
          selected: [],
          value: dataSets
        }
      })
    } catch (e) {
      console.log(e)
    }
  }

  onSubmit = async () => {
    try {
      const {
        startDate,
        endDate,
        exportFormat,
        compression,
        dataElementIdScheme,
        orgUnitIdScheme,
        categoryOptionComboIdScheme,
        selectedDataSets
      } = this.getFormState()

      console.log('this.getFormState()')
      console.log(this.getFormState())

      const params = {}
      params['selectedDataSets'] = selectedDataSets
      params['startDate'] = startDate
      params['endDate'] = endDate
      params['exportFormat'] = exportFormat
      params['compression'] = compression
      params['dataElementIdScheme'] = dataElementIdScheme
      params['orgUnitIdScheme'] = orgUnitIdScheme
      params['categoryOptionComboIdScheme'] = categoryOptionComboIdScheme
    } catch (e) {
      console.log('Data Export error', e, '\n')
    }
  }
}
