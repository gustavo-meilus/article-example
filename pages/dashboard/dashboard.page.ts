import { Page, Locator } from '@playwright/test';
import { PageBase } from '../base/page.base';
import { AreasChartComponent } from './areas-chart/areas-chart.component';
import { BudgetChartComponent } from './budget-chart/budget-chart.component';
import { locators, onLoadLocators } from './dashboard.locators';
import { OrderTableComponent } from './order-table/order-table.component';
import { ProgressCardComponent } from './progress-card/progress-card.component';
import { StatsChartComponent } from './stats-chart/stats-chart.component';
import { TodoListComponent } from './todo-list/todo-list.component';
import { WeekChartComponent } from './week-chart/week-chart.component';

export class DashboardPage extends PageBase {
    readonly url = './vue-element-admin/#/dashboard';
    readonly onLoadLocators: Record<string, Locator>;
    readonly locators: Record<string, Locator>;

    // Components
    readonly statsChart: StatsChartComponent;
    readonly budgetChart: BudgetChartComponent;
    readonly areasChart: AreasChartComponent;
    readonly weekChart: WeekChartComponent;
    readonly orderTable: OrderTableComponent;
    readonly todoList: TodoListComponent;
    readonly progressCard: ProgressCardComponent;

    constructor(page: Page) {
        super(page);
        this.onLoadLocators = onLoadLocators(page);

        // Components
        this.statsChart = new StatsChartComponent(page);
        this.budgetChart = new BudgetChartComponent(page);
        this.areasChart = new AreasChartComponent(page);
        this.weekChart = new WeekChartComponent(page);
        this.orderTable = new OrderTableComponent(page);
        this.todoList = new TodoListComponent(page);
        this.progressCard = new ProgressCardComponent(page);

        // Merge locators to dashboard
        this.locators = {
            ...locators(page),
            ...this.statsChart.locators,
            ...this.budgetChart.locators,
            ...this.areasChart.locators,
            ...this.weekChart.locators,
            ...this.orderTable.locators,
            ...this.todoList.locators,
            ...this.progressCard.locators,
        };
        this.onLoadLocators = {
            ...onLoadLocators(page),
            ...this.statsChart.onLoadLocators,
            ...this.budgetChart.onLoadLocators,
            ...this.areasChart.onLoadLocators,
            ...this.weekChart.onLoadLocators,
            ...this.orderTable.onLoadLocators,
            ...this.todoList.onLoadLocators,
            ...this.progressCard.onLoadLocators,
        };
    }
}
