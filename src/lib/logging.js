import dateFormat from 'date-format'
import winston from 'winston'

winston.default.transports.console.formatter = ({ meta, level, message }) => {
  const { componentName, functionName, code } = meta
  return [
    dateFormat.asString('yyyy-MM-dd hh:mm:ss,SSS', new Date()),
    componentName || 'NO-COMPONENT',
    level.toUpperCase(),
    functionName || 'NO-FUNCTION',
    code,
    message,
  ].join(' ')
}

winston.level = process.env.npm_package_config_loglevel || 'debug'
