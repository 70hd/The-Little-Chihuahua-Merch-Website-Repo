import React from 'react'
import { motion } from 'framer-motion'

const AnimatedArrow = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <motion.img
      src="/icons/right-arrow.svg"
      width={20}
      height={20}
      alt="Dropdown arrow"
      animate={{ rotate: isOpen ? 90 : 0 }}
      transition={{ duration: 0.3 }}
    />
  )
}

export default AnimatedArrow