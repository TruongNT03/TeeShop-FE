export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  SHIPPING = "shipping",
  COMPLETED = "completed",
  CANCEL = "cancel",
}

export const orderStatusStateMachine = (
  currentStatus: OrderStatus,
  nextStatus: OrderStatus
) => {
  const stateMachineMap: Record<OrderStatus, Record<OrderStatus, boolean>> = {
    [OrderStatus.PENDING]: {
      [OrderStatus.PENDING]: false,
      [OrderStatus.CONFIRMED]: true,
      [OrderStatus.SHIPPING]: true,
      [OrderStatus.COMPLETED]: false,
      [OrderStatus.CANCEL]: true,
    },

    [OrderStatus.CONFIRMED]: {
      [OrderStatus.PENDING]: false,
      [OrderStatus.CONFIRMED]: false,
      [OrderStatus.SHIPPING]: true,
      [OrderStatus.COMPLETED]: false,
      [OrderStatus.CANCEL]: true,
    },

    [OrderStatus.SHIPPING]: {
      [OrderStatus.PENDING]: false,
      [OrderStatus.CONFIRMED]: false,
      [OrderStatus.SHIPPING]: false,
      [OrderStatus.COMPLETED]: true,
      [OrderStatus.CANCEL]: false,
    },

    [OrderStatus.COMPLETED]: {
      [OrderStatus.PENDING]: false,
      [OrderStatus.CONFIRMED]: false,
      [OrderStatus.SHIPPING]: false,
      [OrderStatus.COMPLETED]: false,
      [OrderStatus.CANCEL]: false,
    },

    [OrderStatus.CANCEL]: {
      [OrderStatus.PENDING]: false,
      [OrderStatus.CONFIRMED]: false,
      [OrderStatus.SHIPPING]: false,
      [OrderStatus.COMPLETED]: false,
      [OrderStatus.CANCEL]: false,
    },
  };

  return stateMachineMap[currentStatus][nextStatus];
};
