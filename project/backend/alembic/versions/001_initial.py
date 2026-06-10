"""Initial migration

Revision ID: 001
Revises:
Create Date: 2024-01-01

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = '001'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('email', sa.String(255), nullable=False),
        sa.Column('hashed_password', sa.String(255), nullable=False),
        sa.Column('full_name', sa.String(255), nullable=True),
        sa.Column('role', sa.String(50), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)

    op.create_table(
        'campaigns',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('product_name', sa.String(255), nullable=False),
        sa.Column('industry', sa.String(255), nullable=False),
        sa.Column('target_audience', sa.String(255), nullable=False),
        sa.Column('campaign_goal', sa.String(255), nullable=False),
        sa.Column('generated_content', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_campaigns_id'), 'campaigns', ['id'], unique=False)

    op.create_table(
        'sales_pitches',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('product', sa.String(255), nullable=False),
        sa.Column('customer_type', sa.String(255), nullable=False),
        sa.Column('generated_content', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_sales_pitches_id'), 'sales_pitches', ['id'], unique=False)

    op.create_table(
        'lead_scores',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('company_size', sa.String(100), nullable=False),
        sa.Column('industry', sa.String(255), nullable=False),
        sa.Column('budget', sa.String(100), nullable=False),
        sa.Column('engagement_level', sa.String(100), nullable=False),
        sa.Column('score', sa.Float(), nullable=True),
        sa.Column('priority', sa.String(50), nullable=True),
        sa.Column('generated_content', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_lead_scores_id'), 'lead_scores', ['id'], unique=False)

    op.create_table(
        'market_analyses',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('industry', sa.String(255), nullable=False),
        sa.Column('generated_content', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_market_analyses_id'), 'market_analyses', ['id'], unique=False)

    op.create_table(
        'business_insights',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('business_description', sa.Text(), nullable=False),
        sa.Column('generated_content', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_business_insights_id'), 'business_insights', ['id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_business_insights_id'), table_name='business_insights')
    op.drop_table('business_insights')

    op.drop_index(op.f('ix_market_analyses_id'), table_name='market_analyses')
    op.drop_table('market_analyses')

    op.drop_index(op.f('ix_lead_scores_id'), table_name='lead_scores')
    op.drop_table('lead_scores')

    op.drop_index(op.f('ix_sales_pitches_id'), table_name='sales_pitches')
    op.drop_table('sales_pitches')

    op.drop_index(op.f('ix_campaigns_id'), table_name='campaigns')
    op.drop_table('campaigns')

    op.drop_index(op.f('ix_users_id'), table_name='users')
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_table('users')
